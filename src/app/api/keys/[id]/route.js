import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function GET(request, context) {
  try {
    const params = await context.params
    const id = params.id
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'API key not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error(`Error fetching API key:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch API key' },
      { status: 500 }
    )
  }
}

export async function PATCH(request, context) {
  try {
    const params = await context.params
    const id = params.id
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('api_keys')
      .update(body)
      .eq('id', id)
      .select()

    if (error) {
      throw error
    }

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: data[0] })
  } catch (error) {
    console.error(`Error updating API key:`, error)
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params
    const id = params.id
    
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting API key:`, error)
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    )
  }
} 