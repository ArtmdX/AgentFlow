/**
 * Settings Service Layer
 * Handles all business logic for agency settings
 */

import prisma from '@/lib/prisma';
import { agencySettingsSchema, smtpTestSchema } from '@/lib/validations';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Encryption key for SMTP password (in production, use env variable)
const ENCRYPTION_KEY = process.env.SETTINGS_ENCRYPTION_KEY || 'agentflow-default-encryption-key-32b';
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * Encrypt sensitive data
 */
function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt sensitive data
 */
function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  const key = Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Default settings values
 */
const DEFAULT_SETTINGS = {
  agencyName: 'AgentFlow',
  defaultCurrency: 'BRL' as const,
  interestRate: 0,
  fineRate: 0,
  smtpPort: 587,
  smtpSecure: false,
  addressCountry: 'Brasil',
  notificationsEnabled: true,
  emailNotificationsEnabled: true,
  exchangeRates: {
    USD: 5.0,
    EUR: 5.5,
    ARS: 0.02,
  },
};

/**
 * Get agency settings (creates default if not exists)
 */
export async function getSettings() {
  try {
    let settings = await prisma.agencySettings.findFirst();

    // Create default settings if not exists
    if (!settings) {
      settings = await prisma.agencySettings.create({
        data: DEFAULT_SETTINGS,
      });
    }

    // Hide SMTP password
    const settingsResponse = {
      ...settings,
      smtpPassword: settings.smtpPassword ? '********' : null,
      interestRate: settings.interestRate ? Number(settings.interestRate) : null,
      fineRate: settings.fineRate ? Number(settings.fineRate) : null,
    };

    return settingsResponse;
  } catch (error) {
    console.error('Error getting settings:', error);
    throw new Error('Erro ao buscar configurações');
  }
}

/**
 * Update agency settings
 */
export async function updateSettings(data: z.infer<typeof agencySettingsSchema>) {
  try {
    // Validate data
    const validatedData = agencySettingsSchema.parse(data);

    // Get current settings
    let settings = await prisma.agencySettings.findFirst();

    // Prepare update data
    const updateData: any = { ...validatedData };

    // Encrypt SMTP password if provided and not masked
    if (validatedData.smtpPassword && validatedData.smtpPassword !== '********') {
      updateData.smtpPassword = encrypt(validatedData.smtpPassword);
    } else if (validatedData.smtpPassword === '********') {
      // Keep existing password
      delete updateData.smtpPassword;
    }

    // Convert empty strings to null for optional fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '') {
        updateData[key] = null;
      }
    });

    // Update or create settings
    if (settings) {
      settings = await prisma.agencySettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    } else {
      settings = await prisma.agencySettings.create({
        data: { ...DEFAULT_SETTINGS, ...updateData },
      });
    }

    // Hide SMTP password in response
    const response = {
      ...settings,
      smtpPassword: settings.smtpPassword ? '********' : null,
      interestRate: settings.interestRate ? Number(settings.interestRate) : null,
      fineRate: settings.fineRate ? Number(settings.fineRate) : null,
    };

    return response;
  } catch (error) {
    console.error('Error updating settings:', error);
    if (error instanceof z.ZodError) {
      throw new Error('Dados inválidos: ' + error.errors.map(e => e.message).join(', '));
    }
    throw new Error('Erro ao atualizar configurações');
  }
}

/**
 * Test SMTP connection
 */
export async function testSmtpConnection(config: z.infer<typeof smtpTestSchema>) {
  try {
    // Validate config
    const validatedConfig = smtpTestSchema.parse(config);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: validatedConfig.smtpHost,
      port: validatedConfig.smtpPort,
      secure: validatedConfig.smtpSecure,
      auth: {
        user: validatedConfig.smtpUser,
        pass: validatedConfig.smtpPassword,
      },
      // Timeout after 10 seconds
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });

    // Verify connection
    await transporter.verify();

    // Send test email
    await transporter.sendMail({
      from: `"${validatedConfig.smtpFromName}" <${validatedConfig.smtpFromEmail}>`,
      to: validatedConfig.testEmail,
      subject: 'AgentFlow - Teste de Configuração SMTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Teste de Configuração SMTP</h2>
          <p>Este é um email de teste para verificar a configuração SMTP do AgentFlow.</p>
          <p>Se você recebeu este email, a configuração está funcionando corretamente!</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="color: #6B7280; font-size: 12px;">
            Email enviado em ${new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      `,
      text: `AgentFlow - Teste de Configuração SMTP\n\nEste é um email de teste para verificar a configuração SMTP do AgentFlow.\n\nSe você recebeu este email, a configuração está funcionando corretamente!\n\nEmail enviado em ${new Date().toLocaleString('pt-BR')}`,
    });

    return {
      success: true,
      message: 'Email de teste enviado com sucesso! Verifique a caixa de entrada.',
    };
  } catch (error: any) {
    console.error('SMTP test error:', error);
    return {
      success: false,
      message: error.message || 'Erro ao testar conexão SMTP',
    };
  }
}

/**
 * Export backup (all settings as JSON)
 */
export async function exportBackup() {
  try {
    const settings = await prisma.agencySettings.findFirst();

    if (!settings) {
      throw new Error('Nenhuma configuração encontrada');
    }

    // Decrypt SMTP password for backup
    const backup = {
      ...settings,
      smtpPassword: settings.smtpPassword ? decrypt(settings.smtpPassword) : null,
      interestRate: settings.interestRate ? Number(settings.interestRate) : null,
      fineRate: settings.fineRate ? Number(settings.fineRate) : null,
      _metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        appName: 'AgentFlow',
      },
    };

    return backup;
  } catch (error) {
    console.error('Error exporting backup:', error);
    throw new Error('Erro ao exportar backup');
  }
}

/**
 * Import backup (restore settings from JSON)
 */
export async function importBackup(backupData: any) {
  try {
    // Validate backup data
    if (!backupData || typeof backupData !== 'object') {
      throw new Error('Dados de backup inválidos');
    }

    // Remove metadata
    const { _metadata, id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...settingsData } = backupData;

    // Validate settings
    const validatedData = agencySettingsSchema.parse(settingsData);

    // Encrypt SMTP password if present
    const importData: any = { ...validatedData };
    if (importData.smtpPassword) {
      importData.smtpPassword = encrypt(importData.smtpPassword);
    }

    // Get current settings
    const currentSettings = await prisma.agencySettings.findFirst();

    if (currentSettings) {
      // Update existing
      await prisma.agencySettings.update({
        where: { id: currentSettings.id },
        data: importData,
      });
    } else {
      // Create new
      await prisma.agencySettings.create({
        data: { ...DEFAULT_SETTINGS, ...importData },
      });
    }

    return {
      success: true,
      message: 'Backup restaurado com sucesso!',
    };
  } catch (error) {
    console.error('Error importing backup:', error);
    if (error instanceof z.ZodError) {
      throw new Error('Dados de backup inválidos: ' + error.errors.map(e => e.message).join(', '));
    }
    throw new Error('Erro ao importar backup');
  }
}

/**
 * Get decrypted SMTP password (for internal use only)
 */
export async function getDecryptedSmtpPassword(): Promise<string | null> {
  try {
    const settings = await prisma.agencySettings.findFirst();
    if (!settings?.smtpPassword) return null;
    return decrypt(settings.smtpPassword);
  } catch (error) {
    console.error('Error decrypting SMTP password:', error);
    return null;
  }
}
