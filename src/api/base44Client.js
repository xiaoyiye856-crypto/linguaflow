import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Compatibility shim for legacy base44 calls
export const base44 = {
  entities: {
    AussieVocabulary: {
      list: () => supabase.from('AussieVocabulary').select('*'),
      create: (data) => supabase.from('AussieVocabulary').insert(data).select().single(),
      update: (id, data) => supabase.from('AussieVocabulary').update(data).eq('id', id),
      delete: (id) => supabase.from('AussieVocabulary').delete().eq('id', id),
    },
    AussieDialogue: {
      list: () => supabase.from('AussieDialogue').select('*'),
      create: (data) => supabase.from('AussieDialogue').insert(data).select().single(),
      update: (id, data) => supabase.from('AussieDialogue').update(data).eq('id', id),
      delete: (id) => supabase.from('AussieDialogue').delete().eq('id', id),
    },
    Article: {
      list: () => supabase.from('Article').select('*'),
      create: (data) => supabase.from('Article').insert(data).select().single(),
      update: (id, data) => supabase.from('Article').update(data).eq('id', id),
      delete: (id) => supabase.from('Article').delete().eq('id', id),
    },
    Sentence: {
      list: () => supabase.from('Sentence').select('*'),
      create: (data) => supabase.from('Sentence').insert(data).select().single(),
    },
  },
  auth: {
    me: () => supabase.auth.getUser(),
  },
  integrations: {
    Core: {
      InvokeLLM: async ({ prompt, response_json_schema }) => {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, response_json_schema }),
        });
        return res.json();
      },
    },
  },
};
