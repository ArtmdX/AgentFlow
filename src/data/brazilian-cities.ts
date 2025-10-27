/**
 * Brazilian Cities with IATA Codes
 *
 * Database of major Brazilian airports with their IATA codes for autocomplete
 * Format: CODE - City/State (e.g., "BSB - Brasília/DF")
 */

export interface BrazilianCity {
  iataCode: string;
  cityName: string;
  state: string;
  stateCode: string;
  airportName?: string;
}

export const brazilianCities: BrazilianCity[] = [
  // Região Norte
  { iataCode: 'MAO', cityName: 'Manaus', state: 'Amazonas', stateCode: 'AM', airportName: 'Aeroporto Internacional Eduardo Gomes' },
  { iataCode: 'BEL', cityName: 'Belém', state: 'Pará', stateCode: 'PA', airportName: 'Aeroporto Internacional Val de Cans' },
  { iataCode: 'PVH', cityName: 'Porto Velho', state: 'Rondônia', stateCode: 'RO', airportName: 'Aeroporto Internacional Governador Jorge Teixeira' },
  { iataCode: 'RBR', cityName: 'Rio Branco', state: 'Acre', stateCode: 'AC', airportName: 'Aeroporto Internacional Plácido de Castro' },
  { iataCode: 'BVB', cityName: 'Boa Vista', state: 'Roraima', stateCode: 'RR', airportName: 'Aeroporto Internacional Atlas Brasil Cantanhede' },
  { iataCode: 'MCP', cityName: 'Macapá', state: 'Amapá', stateCode: 'AP', airportName: 'Aeroporto Internacional Alberto Alcolumbre' },
  { iataCode: 'PFB', cityName: 'Passo Fundo', state: 'Rio Grande do Sul', stateCode: 'RS', airportName: 'Aeroporto Lauro Kurtz' },

  // Região Nordeste
  { iataCode: 'SSA', cityName: 'Salvador', state: 'Bahia', stateCode: 'BA', airportName: 'Aeroporto Internacional de Salvador' },
  { iataCode: 'REC', cityName: 'Recife', state: 'Pernambuco', stateCode: 'PE', airportName: 'Aeroporto Internacional do Recife/Guararapes' },
  { iataCode: 'FOR', cityName: 'Fortaleza', state: 'Ceará', stateCode: 'CE', airportName: 'Aeroporto Internacional Pinto Martins' },
  { iataCode: 'NAT', cityName: 'Natal', state: 'Rio Grande do Norte', stateCode: 'RN', airportName: 'Aeroporto Internacional Aluízio Alves' },
  { iataCode: 'MCZ', cityName: 'Maceió', state: 'Alagoas', stateCode: 'AL', airportName: 'Aeroporto Internacional Zumbi dos Palmares' },
  { iataCode: 'AJU', cityName: 'Aracaju', state: 'Sergipe', stateCode: 'SE', airportName: 'Aeroporto Santa Maria' },
  { iataCode: 'JPA', cityName: 'João Pessoa', state: 'Paraíba', stateCode: 'PB', airportName: 'Aeroporto Internacional Castro Pinto' },
  { iataCode: 'THE', cityName: 'Teresina', state: 'Piauí', stateCode: 'PI', airportName: 'Aeroporto Senador Petrônio Portella' },
  { iataCode: 'SLZ', cityName: 'São Luís', state: 'Maranhão', stateCode: 'MA', airportName: 'Aeroporto Internacional Marechal Cunha Machado' },
  { iataCode: 'IOS', cityName: 'Ilhéus', state: 'Bahia', stateCode: 'BA', airportName: 'Aeroporto Jorge Amado' },
  { iataCode: 'VDC', cityName: 'Vitória da Conquista', state: 'Bahia', stateCode: 'BA', airportName: 'Aeroporto Glauber Rocha' },
  { iataCode: 'PNZ', cityName: 'Petrolina', state: 'Pernambuco', stateCode: 'PE', airportName: 'Aeroporto Senador Nilo Coelho' },
  { iataCode: 'JDO', cityName: 'Juazeiro do Norte', state: 'Ceará', stateCode: 'CE', airportName: 'Aeroporto Regional do Cariri' },

  // Região Centro-Oeste
  { iataCode: 'BSB', cityName: 'Brasília', state: 'Distrito Federal', stateCode: 'DF', airportName: 'Aeroporto Internacional Juscelino Kubitschek' },
  { iataCode: 'GYN', cityName: 'Goiânia', state: 'Goiás', stateCode: 'GO', airportName: 'Aeroporto Santa Genoveva' },
  { iataCode: 'CGB', cityName: 'Cuiabá', state: 'Mato Grosso', stateCode: 'MT', airportName: 'Aeroporto Internacional Marechal Rondon' },
  { iataCode: 'CGR', cityName: 'Campo Grande', state: 'Mato Grosso do Sul', stateCode: 'MS', airportName: 'Aeroporto Internacional de Campo Grande' },
  { iataCode: 'CMG', cityName: 'Corumbá', state: 'Mato Grosso do Sul', stateCode: 'MS', airportName: 'Aeroporto Internacional de Corumbá' },
  { iataCode: 'VDC', cityName: 'Caldas Novas', state: 'Goiás', stateCode: 'GO', airportName: 'Aeroporto de Caldas Novas' },

  // Região Sudeste
  { iataCode: 'GRU', cityName: 'São Paulo', state: 'São Paulo', stateCode: 'SP', airportName: 'Aeroporto Internacional de Guarulhos' },
  { iataCode: 'CGH', cityName: 'São Paulo', state: 'São Paulo', stateCode: 'SP', airportName: 'Aeroporto de Congonhas' },
  { iataCode: 'VCP', cityName: 'Campinas', state: 'São Paulo', stateCode: 'SP', airportName: 'Aeroporto Internacional de Viracopos' },
  { iataCode: 'GIG', cityName: 'Rio de Janeiro', state: 'Rio de Janeiro', stateCode: 'RJ', airportName: 'Aeroporto Internacional do Galeão' },
  { iataCode: 'SDU', cityName: 'Rio de Janeiro', state: 'Rio de Janeiro', stateCode: 'RJ', airportName: 'Aeroporto Santos Dumont' },
  { iataCode: 'CNF', cityName: 'Belo Horizonte', state: 'Minas Gerais', stateCode: 'MG', airportName: 'Aeroporto Internacional de Confins' },
  { iataCode: 'PLU', cityName: 'Belo Horizonte', state: 'Minas Gerais', stateCode: 'MG', airportName: 'Aeroporto da Pampulha' },
  { iataCode: 'VIX', cityName: 'Vitória', state: 'Espírito Santo', stateCode: 'ES', airportName: 'Aeroporto Eurico de Aguiar Salles' },
  { iataCode: 'RAO', cityName: 'Ribeirão Preto', state: 'São Paulo', stateCode: 'SP', airportName: 'Aeroporto Leite Lopes' },
  { iataCode: 'SJK', cityName: 'São José dos Campos', state: 'São Paulo', stateCode: 'SP', airportName: 'Aeroporto de São José dos Campos' },
  { iataCode: 'UDI', cityName: 'Uberlândia', state: 'Minas Gerais', stateCode: 'MG', airportName: 'Aeroporto de Uberlândia' },
  { iataCode: 'JDF', cityName: 'Juiz de Fora', state: 'Minas Gerais', stateCode: 'MG', airportName: 'Aeroporto da Zona da Mata' },
  { iataCode: 'MOC', cityName: 'Montes Claros', state: 'Minas Gerais', stateCode: 'MG', airportName: 'Aeroporto Mário Ribeiro' },
  { iataCode: 'SOD', cityName: 'Sorocaba', state: 'São Paulo', stateCode: 'SP', airportName: 'Aeroporto Bertram Luiz Leupolz' },
  { iataCode: 'BAU', cityName: 'Bauru', state: 'São Paulo', stateCode: 'SP', airportName: 'Aeroporto Moussa Nakhl Tobias' },
  { iataCode: 'IPN', cityName: 'Ipatinga', state: 'Minas Gerais', stateCode: 'MG', airportName: 'Aeroporto de Ipatinga/Usiminas' },

  // Região Sul
  { iataCode: 'CWB', cityName: 'Curitiba', state: 'Paraná', stateCode: 'PR', airportName: 'Aeroporto Internacional Afonso Pena' },
  { iataCode: 'POA', cityName: 'Porto Alegre', state: 'Rio Grande do Sul', stateCode: 'RS', airportName: 'Aeroporto Internacional Salgado Filho' },
  { iataCode: 'FLN', cityName: 'Florianópolis', state: 'Santa Catarina', stateCode: 'SC', airportName: 'Aeroporto Internacional Hercílio Luz' },
  { iataCode: 'IGU', cityName: 'Foz do Iguaçu', state: 'Paraná', stateCode: 'PR', airportName: 'Aeroporto Internacional de Foz do Iguaçu' },
  { iataCode: 'NVT', cityName: 'Navegantes', state: 'Santa Catarina', stateCode: 'SC', airportName: 'Aeroporto Internacional de Navegantes' },
  { iataCode: 'JOI', cityName: 'Joinville', state: 'Santa Catarina', stateCode: 'SC', airportName: 'Aeroporto de Joinville' },
  { iataCode: 'LDB', cityName: 'Londrina', state: 'Paraná', stateCode: 'PR', airportName: 'Aeroporto de Londrina' },
  { iataCode: 'MGF', cityName: 'Maringá', state: 'Paraná', stateCode: 'PR', airportName: 'Aeroporto Regional de Maringá' },
  { iataCode: 'CAC', cityName: 'Cascavel', state: 'Paraná', stateCode: 'PR', airportName: 'Aeroporto Municipal de Cascavel' },
  { iataCode: 'PET', cityName: 'Pelotas', state: 'Rio Grande do Sul', stateCode: 'RS', airportName: 'Aeroporto Internacional de Pelotas' },
  { iataCode: 'CXJ', cityName: 'Caxias do Sul', state: 'Rio Grande do Sul', stateCode: 'RS', airportName: 'Aeroporto Hugo Cantergiani' },
];

/**
 * Formats a city for display in autocomplete
 */
export function formatCityDisplay(city: BrazilianCity): string {
  return `${city.iataCode} - ${city.cityName}/${city.stateCode}`;
}

/**
 * Searches cities by IATA code, city name, or state
 */
export function searchCities(query: string): BrazilianCity[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();

  return brazilianCities.filter(city => {
    const iataMatch = city.iataCode.toLowerCase().includes(normalizedQuery);
    const cityMatch = city.cityName.toLowerCase().includes(normalizedQuery);
    const stateMatch = city.state.toLowerCase().includes(normalizedQuery);
    const stateCodeMatch = city.stateCode.toLowerCase().includes(normalizedQuery);

    return iataMatch || cityMatch || stateMatch || stateCodeMatch;
  }).sort((a, b) => {
    // Prioritize IATA code exact matches
    const aIataExact = a.iataCode.toLowerCase() === normalizedQuery;
    const bIataExact = b.iataCode.toLowerCase() === normalizedQuery;

    if (aIataExact && !bIataExact) return -1;
    if (!aIataExact && bIataExact) return 1;

    // Then prioritize IATA code starts with
    const aIataStarts = a.iataCode.toLowerCase().startsWith(normalizedQuery);
    const bIataStarts = b.iataCode.toLowerCase().startsWith(normalizedQuery);

    if (aIataStarts && !bIataStarts) return -1;
    if (!aIataStarts && bIataStarts) return 1;

    // Then city name starts with
    const aCityStarts = a.cityName.toLowerCase().startsWith(normalizedQuery);
    const bCityStarts = b.cityName.toLowerCase().startsWith(normalizedQuery);

    if (aCityStarts && !bCityStarts) return -1;
    if (!aCityStarts && bCityStarts) return 1;

    // Finally alphabetical by city name
    return a.cityName.localeCompare(b.cityName);
  }).slice(0, 10); // Limit to top 10 results
}

/**
 * Finds a city by exact IATA code match
 */
export function findCityByIATA(iataCode: string): BrazilianCity | undefined {
  return brazilianCities.find(city =>
    city.iataCode.toLowerCase() === iataCode.toLowerCase()
  );
}

/**
 * Validates if a string is in the correct IATA format
 */
export function isValidIATAFormat(value: string): boolean {
  // Format: "CODE - City/State" (e.g., "BSB - Brasília/DF")
  const iataRegex = /^[A-Z]{3}\s-\s.+\/.{2}$/;
  return iataRegex.test(value);
}

/**
 * Extracts IATA code from formatted string
 */
export function extractIATACode(formattedValue: string): string | null {
  const match = formattedValue.match(/^([A-Z]{3})\s-\s/);
  return match ? match[1] : null;
}
