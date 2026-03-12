import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function makeEntity(tableName) {
  return {
    list: async (filters) => {
      let query = supabase.from(tableName).select('*');
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    get: async (id) => {
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    create: async (record) => {
      const { data, error } = await supabase.from(tableName).insert(record).select().single();
      if (error) throw error;
      return data;
    },
    update: async (id, record) => {
      const { data, error } = await supabase.from(tableName).update(record).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    delete: async (id) => {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      return true;
    },
  };
}

export const base44 = {
  entities: {
    AussieVocabulary: makeEntity('AussieVocabulary'),
    AussieDialogue:   makeEntity('AussieDialogue'),
    AussieSentence:   makeEntity('AussieSentence'),
    Article:          makeEntity('Article'),
    Sentence:         makeEntity('Sentence'),
    UserProgress:     makeEntity('UserProgress'),
  },
  auth: {
    me: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  },
  integrations: {
    Core: {
      InvokeLLM: async ({ prompt, response_json_schema }) => {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, response_json_schema }),
        });
        if (!res.ok) throw new Error('API call failed');
        return res.json();
      },
    },
  },
};
