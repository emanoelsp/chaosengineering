import * as dotenv from 'dotenv'
import * as path from 'path'
import { randomUUID } from 'crypto'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`

// ─── Conversor para formato Firestore REST ────────────────────────────────────

function toValue(v: unknown): unknown {
  if (v === null || v === undefined) return { nullValue: null }
  if (typeof v === 'boolean') return { booleanValue: v }
  if (typeof v === 'number') {
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }
  }
  if (typeof v === 'string') return { stringValue: v }
  if (v instanceof Date) return { timestampValue: v.toISOString() }
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toValue) } }
  if (typeof v === 'object') {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(v as Record<string, unknown>).map(([k, val]) => [k, toValue(val)])
        ),
      },
    }
  }
  return { stringValue: String(v) }
}

function toFields(data: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, toValue(v)]))
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function upsert(collection: string, id: string, data: Record<string, unknown>) {
  const url = `${BASE_URL}/${collection}/${id}?key=${API_KEY}`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: toFields(data) }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Firestore error [${collection}/${id}]: ${JSON.stringify(err.error ?? err)}`)
  }
  return res.json()
}

async function deleteCollection(collection: string) {
  const url = `${BASE_URL}/${collection}?key=${API_KEY}&pageSize=100`
  const res = await fetch(url)
  if (!res.ok) return
  const data = await res.json()
  const docs: { name: string }[] = data.documents ?? []
  for (const doc of docs) {
    const docUrl = `https://firestore.googleapis.com/v1/${doc.name}?key=${API_KEY}`
    await fetch(docUrl, { method: 'DELETE' })
  }
}

// ─── Dados ────────────────────────────────────────────────────────────────────

const NOW = new Date()

const PRODUCTS = [
  {
    id: 'capivara-classica',
    nome: 'Capivara Clássica',
    descricao: 'A capivara de pelúcia original. Fofa, rechonchuda e pronta para relaxar no seu colo.',
    preco: 89.9,
    estoque: 50,
    categoria: 'classicos',
    imageUrl: 'https://placehold.co/400x400/D2B48C/5C3317?text=%F0%9F%A6%AB',
    peso: 0.3,
  },
  {
    id: 'capivara-laranjinha',
    nome: 'Capivara com Laranjinha',
    descricao: 'A famosa versão com laranjinha na cabeça. Vem com 3 laranjas removíveis. Viral no TikTok.',
    preco: 119.9,
    estoque: 30,
    categoria: 'especiais',
    imageUrl: 'https://placehold.co/400x400/FFA500/5C3317?text=%F0%9F%A6%AB%F0%9F%8D%8A',
    peso: 0.35,
  },
  {
    id: 'capivara-baby',
    nome: 'Capivara Baby',
    descricao: 'Miniatura que cabe no bolso. Porque capivara de pelúcia não é só para casa, é para a vida.',
    preco: 49.9,
    estoque: 80,
    categoria: 'classicos',
    imageUrl: 'https://placehold.co/400x400/F5DEB3/5C3317?text=baby+%F0%9F%A6%AB',
    peso: 0.1,
  },
  {
    id: 'capivara-jumbo',
    nome: 'Capivara Jumbo XL',
    descricao: '80cm de puro relaxamento. Grande o suficiente para usar como travesseiro. Aprovada por onças-pintadas.',
    preco: 249.9,
    estoque: 15,
    categoria: 'jumbo',
    imageUrl: 'https://placehold.co/400x400/8B6914/FFFFFF?text=%F0%9F%A6%AB+XL',
    peso: 1.2,
  },
  {
    id: 'capivara-pijama',
    nome: 'Capivara em Pijama',
    descricao: 'Pronta para não fazer absolutamente nada. Pijama de listrinhas removível incluído.',
    preco: 129.9,
    estoque: 25,
    categoria: 'especiais',
    imageUrl: 'https://placehold.co/400x400/9B59B6/FFFFFF?text=%F0%9F%A6%AB%F0%9F%92%A4',
    peso: 0.35,
  },
  {
    id: 'capivara-astronauta',
    nome: 'Capivara Astronauta',
    descricao: 'Para a capivara que sempre sonhou em nadar nas estrelas. Capacete incluído. Missão: relaxar.',
    preco: 159.9,
    estoque: 20,
    categoria: 'especiais',
    imageUrl: 'https://placehold.co/400x400/1A3A6B/FFFFFF?text=%F0%9F%A6%AB%F0%9F%9A%80',
    peso: 0.45,
  },
  {
    id: 'capivara-detetive',
    nome: 'Capivara Detetive',
    descricao: 'Investigando por que o carrinho sempre trava. Lupa e chapéu incluídos. Especialista em Circuit Breakers.',
    preco: 109.9,
    estoque: 20,
    categoria: 'especiais',
    imageUrl: 'https://placehold.co/400x400/2C3E50/FFFFFF?text=%F0%9F%A6%AB%F0%9F%94%8D',
    peso: 0.4,
  },
  {
    id: 'kit-familia',
    nome: 'Kit Família Capivara',
    descricao: 'Papai (G), Mamãe (M) e Filhote (P). Porque capivaras são animais sociais.',
    preco: 229.9,
    estoque: 10,
    categoria: 'kits',
    imageUrl: 'https://placehold.co/400x400/27AE60/FFFFFF?text=%F0%9F%A6%AB%F0%9F%A6%AB%F0%9F%A6%AB',
    peso: 0.9,
  },
]

// Usuários de demo (apenas o documento Firestore — Auth deve ser criado manualmente ou via Console)
const DEMO_USERS = [
  {
    id: 'demo-professor',
    email: 'professor@demo.com',
    displayName: 'Prof. Chaos',
    role: 'professor',
  },
  {
    id: 'demo-aluno',
    email: 'aluno@demo.com',
    displayName: 'Aluno Teste',
    role: 'aluno',
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!API_KEY || !PROJECT_ID) {
    console.error('❌ NEXT_PUBLIC_FIREBASE_API_KEY ou NEXT_PUBLIC_FIREBASE_PROJECT_ID não configurados.')
    process.exit(1)
  }

  console.log(`\n🌱 Seed — projeto: ${PROJECT_ID}\n`)

  // Produtos
  console.log('📦 Limpando collection products...')
  await deleteCollection('products')

  console.log('📦 Inserindo produtos:')
  for (const { id, ...data } of PRODUCTS) {
    await upsert('products', id, { ...data, createdAt: NOW, updatedAt: NOW })
    console.log(`   ✔ ${data.nome} (R$ ${data.preco.toFixed(2)}) — estoque: ${data.estoque}`)
  }

  // Usuários de demo (Firestore only)
  console.log('\n👤 Inserindo usuários de demo no Firestore:')
  for (const { id, ...data } of DEMO_USERS) {
    await upsert('users', id, { ...data, createdAt: NOW })
    console.log(`   ✔ ${data.displayName} <${data.email}> [${data.role}]`)
  }

  // Índice necessário (instrução)
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Seed concluído! ${PRODUCTS.length} produtos + ${DEMO_USERS.length} usuários de demo.

⚠️  AÇÃO NECESSÁRIA — Criar índice composto no Firestore:
    (a query de produtos usa where(estoque>0) + orderBy(nome))

    Acesse o link abaixo e clique em "Criar índice":
    https://console.firebase.google.com/project/${PROJECT_ID}/firestore/indexes

    Campos: coleção=products | estoque ASC | nome ASC

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `)
}

main().catch((err) => {
  console.error('\n❌ Erro no seed:')
  if (err.message?.includes('PERMISSION_DENIED') || err.message?.includes('403')) {
    console.error(`
  O Firestore recusou a escrita. Isso acontece quando as regras de segurança
  exigem autenticação.

  Solução rápida (desenvolvimento):
  1. Acesse: https://console.firebase.google.com/project/${PROJECT_ID}/firestore/rules
  2. Substitua as regras por:

     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if true;
         }
       }
     }

  3. Salve e rode o seed novamente.
  4. Depois volte as regras para produção.
    `)
  } else {
    console.error(err.message)
  }
  process.exit(1)
})
