import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM products');

        return NextResponse.json(result.rows);

    } catch (error) {
        console.error('List products error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try{
        const { name, description, price, stock } = await req.json();

        // Validación básica
        if (!name || price === undefined || stock === undefined) {
            return NextResponse.json(
                { message: 'Missing required fields: name, price, and stock are required.' },
                { status: 400 }
            );
        }

        const result = await pool.query(
            'INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, stock]
        )

        return NextResponse.json(result.rows[0], { status: 201 });

    } catch (error) {
        console.error('Create product error:', error);

        // Error específico para violación de unicidad (si tuvieras una restricción UNIQUE en 'name')
        if (error.code === '23505') { // Código de error de PostgreSQL para unique_violation
            return NextResponse.json(
                { message: 'A product with this name already exists.' },
                { status: 409 } // 409 Conflict
            );
        }

        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
