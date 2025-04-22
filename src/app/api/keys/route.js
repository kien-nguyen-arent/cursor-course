import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.type || !body.key) {
      return NextResponse.json(
        { error: 'Name, type, and key are required' },
        { status: 400 }
      )
    }

    const newKey = {
      name: body.name,
      type: body.type,
      key: body.key,
      usage: 0,
      monthly_limit: body.monthly_limit || null,
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('api_keys')
      .insert(newKey)
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json({ data: data[0] })
  } catch (error) {
    console.error('Error creating API key:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    )
  }
} 