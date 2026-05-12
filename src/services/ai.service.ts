import { AIMessage } from '@/types';

const RESPONSES: Record<string, string> = {
  barato: 'Com base nos seus hábitos de compra, o **Carrefour** tem o melhor custo-benefício para sua lista atual. Para Alimentos e Bebidas, você economizaria aproximadamente **R$ 23,40** comprando lá esta semana.',
  farmacia: 'A **Droga Raia** (300m de você) está com os melhores preços esta semana — em média **18% abaixo** das outras farmácias próximas. Para medicamentos genéricos, a Ultrafarma tem preços ainda menores.',
  esperar: 'Esse produto está no **menor preço dos últimos 3 meses**! Historicamente, promoções assim duram de 2 a 4 dias. Minha recomendação: aproveite agora — a probabilidade de cair mais é baixa.',
  cafe: 'Você costuma comprar café a cada **18 dias** em média. O Nescafé Solúvel está com **30% OFF** no Extra — esse é o menor preço registrado nos últimos 2 meses. Ótima hora para estocar!',
  lista: 'Analisando sua lista de compras, você economizaria **R$ 87,30** dividindo a compra: produtos de limpeza e laticínios no Mercadinho Bom Preço (mais perto) e alimentos no Carrefour. Quer ver o roteiro otimizado?',
  economia: 'Este mês você já economizou **R$ 127,40** — 23% acima da sua meta! Seus melhores descontos foram no Arroz Tio João (24% OFF) e Coca-Cola (46% OFF). Continue assim e bata seu recorde do mês passado.',
  preco: 'Monitorando os últimos 90 dias, esse produto teve uma variação de preço entre **R$ 4,20** e **R$ 8,90**. O preço atual está **32% abaixo da média regional**. É um ótimo momento para comprar.',
  proximo: 'Com base nos seus padrões, você provavelmente vai precisar comprar **Leite Integral** nos próximos 3 dias e **Arroz** em até 1 semana. Quer que eu ative alertas quando esses produtos entrarem em promoção?',
};

const FALLBACK_RESPONSES = [
  'Analisando os dados de preços da sua região... Com base no histórico dos últimos 30 dias, o preço atual está **abaixo da média**. Recomendo aproveitar essa promoção!',
  'Ótima pergunta! Considerando seus hábitos de compra e a localização das lojas, a melhor opção para você hoje seria o **Carrefour** — fica a apenas 400m e tem as melhores promoções da semana.',
  'Minha análise indica que esse produto entra em promoção com frequência, geralmente a cada **2-3 semanas**. Se não for urgente, pode valer esperar mais 5 a 7 dias para um desconto ainda maior.',
  'Com base nos preços colaborativos enviados pela comunidade, essa promoção é **verificada e real**! 12 usuários já confirmaram o preço nos últimos 2 dias.',
  'Para otimizar sua compra mensal, recomendo dividir: **mercado** para alimentos e bebidas, e **farmácia** para higiene e medicamentos. Isso costuma gerar uma economia de 15-20% no total.',
];

let fallbackIndex = 0;

function matchResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('barato') || lower.includes('econ') || lower.includes('mercado')) return RESPONSES.barato;
  if (lower.includes('farmac') || lower.includes('remedi') || lower.includes('medic')) return RESPONSES.farmacia;
  if (lower.includes('esper') || lower.includes('vale') || lower.includes('abaixar')) return RESPONSES.esperar;
  if (lower.includes('café') || lower.includes('cafe') || lower.includes('nescaf')) return RESPONSES.cafe;
  if (lower.includes('lista') || lower.includes('compra do mês') || lower.includes('compra mensal')) return RESPONSES.lista;
  if (lower.includes('economi') || lower.includes('quanto') || lower.includes('gastei')) return RESPONSES.economia;
  if (lower.includes('preço') || lower.includes('preco') || lower.includes('histór')) return RESPONSES.preco;
  if (lower.includes('próxim') || lower.includes('proxim') || lower.includes('precis')) return RESPONSES.proximo;
  const response = FALLBACK_RESPONSES[fallbackIndex % FALLBACK_RESPONSES.length];
  fallbackIndex++;
  return response;
}

export async function getAIResponse(messages: AIMessage[]): Promise<string> {
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
  if (!lastUserMessage) return FALLBACK_RESPONSES[0];

  await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
  return matchResponse(lastUserMessage.content);
}

export const SUGGESTED_QUESTIONS = [
  'Onde faço minha compra do mês mais barata?',
  'Qual farmácia está mais barata perto de mim?',
  'Vale esperar essa promoção baixar mais?',
  'Quando devo comprar café?',
  'Como otimizar minha lista de compras?',
  'Quanto economizei este mês?',
];
