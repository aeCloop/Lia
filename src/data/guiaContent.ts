import {
  EmergencyChannel,
  JourneyStage,
  PracticalGuide,
  WarningSignGroup,
} from '../types/guia';

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'planejamento',
    label: 'Planejando a gravidez',
    shortLabel: 'Planejando',
    ageRange: 'Pré-concepção',
    summary: 'Consultas iniciais, preparação emocional, rede de apoio e organização da rotina.',
    starterQuestions: [
      'O que conversar na consulta antes de tentar engravidar?',
      'Como organizar o orçamento e a rede de apoio antes da gestação?',
      'Somos um casal homoafetivo planejando ter um bebê: por onde começar?',
    ],
  },
  {
    id: 'gestacao',
    label: 'Gestação',
    shortLabel: 'Gestação',
    ageRange: '1º ao 3º trimestre',
    summary: 'Pré-natal, exames, desconfortos comuns, plano de parto, enxoval e sinais de alerta.',
    starterQuestions: [
      'O que realmente precisa ir na mala da maternidade pelo SUS ou convênio?',
      'Como montar um plano de parto simples e respeitoso?',
      'Quais sinais na gravidez pedem ida imediata ao pronto-atendimento?',
    ],
  },
  {
    id: 'parto_pos_parto',
    label: 'Parto e pós-parto',
    shortLabel: 'Parto e puerpério',
    ageRange: 'Nascimento e puerpério',
    summary: 'Direito a acompanhante, recuperação física, amamentação inicial e saúde mental.',
    starterQuestions: [
      'Quais são os meus direitos na maternidade, como acompanhante e pele a pele?',
      'Qual a diferença entre baby blues e depressão pós-parto?',
      'Como o parceiro ou a rede de apoio pode ajudar de verdade no puerpério?',
    ],
  },
  {
    id: 'recem_nascido',
    label: 'Recém-nascido',
    shortLabel: '0 a 28 dias',
    ageRange: '0 a 28 dias',
    summary: 'Banho, coto umbilical, sono seguro, livre demanda, cólicas e testes de triagem.',
    starterQuestions: [
      'Como fazer o bebê dormir de forma segura nos primeiros dias?',
      'Como limpar o coto umbilical e dar o primeiro banho sem medo?',
      'Quais são os testes de triagem neonatal feitos logo após o nascimento?',
    ],
  },
  {
    id: 'bebe_1_12m',
    label: 'Bebê de 1 a 12 meses',
    shortLabel: '1 a 12 meses',
    ageRange: '1 a 12 meses',
    summary: 'Caderneta de vacinação, marcos do desenvolvimento, introdução alimentar e segurança.',
    starterQuestions: [
      'Como saber se o bebê está pronto para a introdução alimentar aos 6 meses?',
      'Qual a diferença entre ânsia (reflexo de gag) e engasgo?',
      'Quais cuidados ter com a cadeirinha do carro desde os primeiros passeios?',
    ],
  },
  {
    id: 'primeiros_anos',
    label: 'Primeiros anos',
    shortLabel: '1 a 5 anos',
    ageRange: '1 a 5 anos',
    summary: 'Birras, desfralde gentil, adaptação à creche, brincadeiras e limites com telas.',
    starterQuestions: [
      'Como lidar com birras de uma criança de 2 anos com calma e firmeza?',
      'Quais sinais mostram que a criança está pronta para o desfralde?',
      'Qual a recomendação da SBP sobre uso de telas até os 5 anos?',
    ],
  },
];

export const PRACTICAL_GUIDES: PracticalGuide[] = [
  {
    id: 'sono-seguro',
    title: 'Sono seguro do bebê',
    category: 'Cuidados essenciais',
    sourceLabel: 'SBP · Ministério da Saúde',
    summary:
      'Medidas simples no ambiente de descanso que reduzem riscos durante o sono nos primeiros meses.',
    imageUrl: '/src/assets/images/guia_safe_sleep_1795607798381.jpg',
    imageAlt: 'Berço de madeira com colchão firme e lençol ajustado, sem travesseiros ou objetos soltos.',
    keyPoints: [
      'Coloque o bebê sempre de barriga para cima para dormir.',
      'Use colchão firme e plano, em berço ou moisés próprio no mesmo quarto dos cuidadores.',
      'Mantenha o berço livre de travesseiros, cobertores soltos, protetores de berço e pelúcias.',
      'Evite dormir compartilhando cama, sofá ou poltrona com o bebê e mantenha o ambiente livre de fumo.',
    ],
    promptForGuia:
      'Quero revisar os cuidados de sono seguro para o meu bebê e tirar dúvidas sobre temperatura e roupa.',
  },
  {
    id: 'alimentacao',
    title: 'Amamentação e introdução alimentar',
    category: 'Nutrição 0 a 2+ anos',
    sourceLabel: 'Guia Alimentar · MS · OMS',
    summary:
      'Da livre demanda nos primeiros meses à chegada dos alimentos sólidos por volta dos 6 meses.',
    imageUrl: '/src/assets/images/guia_baby_nutrition_1795607798874.jpg',
    imageAlt: 'Prato com alimentos naturais para bebê: banana, cenoura cozida, abacate e purê.',
    keyPoints: [
      'Aleitamento materno exclusivo até os 6 meses e continuado com alimentos até 2 anos ou mais (ou fórmula orientada pelo pediatra quando necessária).',
      'Não ofereça mel antes de 1 ano, nem açúcar, sal em excesso, sucos industrializados ou ultraprocessados.',
      'Ofereça alimentos in natura amassados ou em cortes seguros, observando a diferença entre ânsia e engasgo.',
      'Converse com o pediatra antes de introduzir alimentos se houver histórico familiar de alergias.',
    ],
    promptForGuia:
      'Pode me explicar o passo a passo da introdução alimentar por volta dos 6 meses e quais alimentos evitar?',
  },
  {
    id: 'saude-mental',
    title: 'Saúde mental no puerpério',
    category: 'Acolhimento',
    sourceLabel: 'Ministério da Saúde · OMS',
    summary:
      'Entender que exaustão, medo e oscilações de humor são comuns — e reconhecer quando pedir apoio.',
    keyPoints: [
      'O baby blues (tristeza passageira e choro fácil) costuma aparecer nas primeiras duas semanas e melhora com descanso e apoio.',
      'Tristeza persistente, perda de interesse, dificuldade de criar vínculo, insônia mesmo quando o bebê dorme ou pensamentos assustadores pedem avaliação profissional.',
      'Procure a Unidade Básica de Saúde (UBS), sua equipe médica ou um psicólogo sem culpa.',
      'Em momentos de crise ou pensamentos de se machucar, não fique só: ligue para o CVV (188) ou SAMU (192).',
    ],
    promptForGuia:
      'Estou me sentindo muito sobrecarregada e emotiva no pós-parto. Como diferenciar o cansaço comum de algo que precisa de ajuda?',
  },
  {
    id: 'vacinacao-caderneta',
    title: 'Caderneta da Criança e vacinas',
    category: 'Prevenção',
    sourceLabel: 'PNI · Ministério da Saúde',
    summary:
      'Acompanhamento de crescimento, marcos e vacinação gratuita pelo Sistema Único de Saúde.',
    keyPoints: [
      'Leve a Caderneta da Criança a todas as consultas de puericultura e salas de vacina.',
      'As vacinas do Programa Nacional de Imunizações (PNI) são seguras, gratuitas no SUS e protegem contra doenças graves.',
      'Testes de triagem neonatal (pezinho, orelhinha, olhinho, coraçãozinho e linguinha) acompanham a saúde logo no início da vida.',
      'Confirme sempre o calendário vacinal atualizado diretamente na UBS ou no portal do Ministério da Saúde.',
    ],
    promptForGuia:
      'Como funciona o acompanhamento na Caderneta da Criança e o que perguntar nas primeiras consultas de puericultura?',
  },
  {
    id: 'transporte-seguranca',
    title: 'Cadeirinha e segurança em casa',
    category: 'Proteção diária',
    sourceLabel: 'CTB · SBP',
    summary:
      'Prevenção de acidentes desde a saída da maternidade até as descobertas da primeira infância.',
    keyPoints: [
      'Use bebê-conforto ou cadeirinha certificada e adequada ao peso e à altura em todo trajeto, inclusive na saída da maternidade.',
      'No Brasil, a lei de trânsito exige dispositivo de retenção infantil adequado à idade e altura da criança.',
      'Em casa, proteja tomadas, janelas (redes de proteção), quinas, produtos de limpeza e medicamentos fora do alcance.',
      'Nunca deixe o bebê sozinho em trocadores, camas altas ou próximo à água.',
    ],
    promptForGuia:
      'Quais cuidados de segurança preciso preparar em casa antes do bebê começar a rolar e engatinhar?',
  },
  {
    id: 'direitos-familia',
    title: 'Direitos, licenças e registro',
    category: 'Cidadania',
    sourceLabel: 'Legislação · INSS · SUS',
    summary:
      'Principais garantias na gestação, no parto e nos primeiros cuidados com a criança.',
    keyPoints: [
      'Lei do Acompanhante: toda gestante tem direito a 1 acompanhante de sua escolha durante pré-parto, parto e pós-parto no SUS e rede privada.',
      'A certidão de nascimento é gratuita em cartório ou nas maternidades conveniadas.',
      'Licença-maternidade, licença-paternidade, salário-maternidade e estabilidade têm regras e prazos que podem variar conforme vínculo ou programa.',
      'Confirme prazos, documentos e valores vigentes diretamente no INSS, na Defensoria ou com seu empregador.',
    ],
    promptForGuia:
      'Quais são os direitos principais na maternidade e os primeiros documentos após o nascimento do bebê?',
  },
];

export const EMERGENCY_CHANNELS: EmergencyChannel[] = [
  {
    id: 'samu',
    name: 'SAMU — Urgência e Emergência Médica',
    number: '192',
    telHref: 'tel:192',
    whenToCall:
      'Emergências na gestação, pós-parto ou com o bebê, engasgo, convulsão, falta de ar ou risco imediato.',
    note: 'Atendimento gratuito em todo o Brasil · Confirme a cobertura local se necessário.',
  },
  {
    id: 'cvv',
    name: 'CVV — Centro de Valorização da Vida',
    number: '188',
    telHref: 'tel:188',
    whenToCall:
      'Apoio emocional sigiloso e gratuito 24h se houver sofrimento intenso ou pensamentos de se machucar.',
    note: 'Também disponível por chat em cvv.org.br · Não fique só.',
  },
  {
    id: 'ligue180',
    name: 'Ligue 180 — Central de Atendimento à Mulher',
    number: '180',
    telHref: 'tel:180',
    whenToCall:
      'Orientação e acolhimento em situações de violência doméstica ou violência obstétrica.',
    note: 'Gratuito e confidencial 24h · Em risco imediato, ligue também para 190.',
  },
  {
    id: 'disque100',
    name: 'Disque 100 — Direitos Humanos e Crianças',
    number: '100',
    telHref: 'tel:100',
    whenToCall:
      'Denúncias e proteção diante de suspeita de violência, abuso ou negligência contra crianças.',
    note: 'Você também pode acionar o Conselho Tutelar ou a delegacia local.',
  },
  {
    id: 'intoxicacao',
    name: 'Disque-Intoxicação (Anvisa)',
    number: '0800 722 6001',
    telHref: 'tel:08007226001',
    whenToCall:
      'Ingestão acidental de produto de limpeza, planta tóxica, veneno ou medicamento.',
    note: 'Confirme este número na sua região e ligue 192 se houver sintomas graves.',
  },
];

export const WARNING_SIGN_GROUPS: WarningSignGroup[] = [
  {
    id: 'gestacao',
    title: 'Sinais de alerta na gestação',
    subtitle: 'Procure a maternidade ou pronto-atendimento imediatamente ou ligue 192.',
    actionText: 'Não aguarde a próxima consulta de pré-natal diante de qualquer um destes sinais:',
    signs: [
      'Sangramento vaginal ou perda de líquido pela vagina',
      'Dor abdominal forte ou contrações regulares antes de 37 semanas',
      'Ausência ou redução importante dos movimentos do bebê',
      'Dor de cabeça forte, visão turva/embaçada ou inchaço súbito no rosto e mãos',
      'Febre alta, falta de ar, desmaio ou convulsão',
    ],
  },
  {
    id: 'pos-parto',
    title: 'Sinais de alerta no pós-parto',
    subtitle: 'Avaliação médica imediata ou SAMU (192).',
    actionText: 'O puerpério exige atenção rápida se surgirem sintomas como:',
    signs: [
      'Sangramento intenso (encharcar um absorvente em pouco tempo ou coágulos grandes)',
      'Febre ou secreção vaginal com mau cheiro',
      'Dor forte na barriga ou na cicatriz da cesárea/laceração',
      'Dor, inchaço ou vermelhidão em uma das pernas',
      'Dor no peito, falta de ar, dor de cabeça forte com visão alterada ou convulsão',
    ],
  },
  {
    id: 'bebe',
    title: 'Sinais de alerta no bebê',
    subtitle: 'Atendimento médico urgente ou SAMU (192).',
    actionText: 'Em bebês pequenos, sinais mudam rápido — busque ajuda imediata se notar:',
    signs: [
      'Febre a partir de 38 °C em bebê com menos de 3 meses',
      'Dificuldade para respirar (peito afundando, respiração muito rápida, gemido ou lábios arroxeados)',
      'Moleza, sonolência excessiva, dificuldade para acordar ou recusa persistente de mamar',
      'Vômitos repetidos, com sangue ou cor esverdeada, ou sinais de desidratação (fralda seca por muitas horas, boca seca)',
      'Convulsão, pele ou olhos muito amarelados, manchas roxas pelo corpo ou choro inconsolável diferente do habitual',
      'Queda/trauma na cabeça, engasgo, queimadura ou ingestão de produto tóxico ou remédio',
    ],
  },
];
