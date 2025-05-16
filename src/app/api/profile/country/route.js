import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const body = await request.json();
    
    const response = await fetch('http://backend:5164/api/profile/country', {
      method: 'PUT',
      headers: {
        ...request.headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Country update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}