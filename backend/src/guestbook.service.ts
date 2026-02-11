import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class GuestbookService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
            process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
        );
    }

    async findAll() {
        const { data, error } = await this.supabase
            .from('guestbook')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    }

    async create(dto: any) {
        const { data, error } = await this.supabase
            .from('guestbook')
            .insert([dto])
            .select();

        if (error) throw new Error(error.message);
        return data;
    }

    async update(id: string, dto: any) {
        const { data, error } = await this.supabase
            .from('guestbook')
            .update(dto)
            .eq('id', id)
            .select();

        if (error) throw new Error(error.message);
        return data;
    }

    async delete(id: string) {
        const { data, error } = await this.supabase
            .from('guestbook')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw new Error(error.message);
        return data;
    }
}
