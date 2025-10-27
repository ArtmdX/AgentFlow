/**
 * City Search API
 *
 * GET /api/cities?q=search_query
 * Returns Brazilian cities with IATA codes matching the search query
 */

import { NextResponse } from 'next/server';
import { searchCities, formatCityDisplay } from '@/data/brazilian-cities';
import { handleAPIError } from '@/lib/error-handler';
import { ValidationError } from '@/lib/errors';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      throw new ValidationError(
        'Parâmetro de busca é obrigatório',
        { field: 'q' }
      );
    }

    if (query.length < 2) {
      throw new ValidationError(
        'Busca deve ter pelo menos 2 caracteres',
        { field: 'q', minLength: 2 }
      );
    }

    const results = searchCities(query);

    const formattedResults = results.map(city => ({
      value: formatCityDisplay(city),
      label: formatCityDisplay(city),
      iataCode: city.iataCode,
      cityName: city.cityName,
      state: city.state,
      stateCode: city.stateCode,
      airportName: city.airportName,
    }));

    return NextResponse.json({
      results: formattedResults,
      count: formattedResults.length,
      query,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
