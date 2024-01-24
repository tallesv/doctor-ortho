export type FormField = {
  id: string;
  linked_id?: string;
  linked_awnswer?: string;
  label: string;
  type: 'text' | 'select';
  options?: string[];
};

export type FormTreeNode = {
  field: FormField;
  children?: FormTreeNode[];
};

export type FormTree = {
  section: FormTreeNode[];
};

export const exampleForm: FormTree[] = [
  {
    section: [
      {
        field: {
          id: 'em_uma_visão_frontal_qual_o_tipo_facial',
          label: 'Em uma visão frontal, qual o tipo facial?',
          type: 'select',
          options: [
            'Mesofacial',
            'Braquifacial',
            'Dolicofacial',
            'Face curta',
            'Face Longa',
          ],
        },
      },
      {
        field: {
          id: 'apresenta_alguma_assimetria_facial_evidente',
          label: 'Apresenta alguma assimetria facial evidente?',
          type: 'select',
          options: ['Sim', 'Não'],
        },
        children: [
          {
            field: {
              id: 'para_qual_lado_é_o_desvio_mandibular',
              linked_id: 'apresenta_alguma_assimetria_facial_evidente',
              linked_awnswer: 'Sim',
              label: 'Para qual lado é o desvio mandibular?',
              type: 'select',
              options: ['Direita', 'Esquerda'],
            },
          },
        ],
      },
    ],
  },
  {
    section: [
      {
        field: {
          id: 'avaliando_o_sorriso_qual_a_relação_da_borda_incisal_dos_incisivos_superiores_com_o_lábio_inferior',
          label:
            'Avaliando o sorriso, qual a relação da borda incisal dos incisivos superiores com o lábio inferior?',
          type: 'select',
          options: [
            'Acompanha o contorno do lábio inferior',
            'Arco reto',
            'Arco invertido',
          ],
        },
      },
      {
        field: {
          id: 'ao_sorrir_como_está_a_exposição_gengival',
          label: 'Ao sorrir como está a exposição gengival?',
          type: 'select',
          options: [
            'Mais de 2mm esposição gengival anterior e posterior',
            'Até 2mm de esposição gengival anterior e posterior',
            'Sem exposição de gengival',
            'Mais de 2mm esposição gengival posterior e até 2mm exposição gengival anterior ',
          ],
        },
      },
    ],
  },
  {
    section: [
      {
        field: {
          id: 'como_percebe_o_corredor_bucal',
          label: 'Como percebe o corredor bucal?',
          type: 'select',
          options: ['Normal', 'Amplo', 'Estreito'],
        },
      },
    ],
  },
  {
    section: [
      {
        field: {
          id: 'em_uma_visão_de_perfil_como_se_classifica_essa_face',
          label: 'Em uma visão de perfil, como se classifica essa face?',
          type: 'select',
          options: [
            'Padrão I (Classe I esquelética)',
            'Padrão II (Classe II esquelética)',
            'Padrão III (Classe III esquelética)',
          ],
        },
        children: [
          {
            field: {
              id: 'qual_a_relação_dos_lábios_superior_e_inferior',
              label: 'Qual a relação dos lábios superior e inferior?',
              linked_id: 'em_uma_visão_de_perfil_como_se_classifica_essa_face',
              linked_awnswer: 'Padrão I (Classe I esquelética)',
              type: 'select',
              options: [
                'Perfil reto',
                'Perfil Biproturso',
                'Perfil Biretrusão',
              ],
            },
          },
          {
            field: {
              id: 'qual_a_relação_do_lábio_superior_com_o_filtro_subnásio',
              label: 'Qual a relação do Lábio superior com o Filtro/Subnásio?',
              linked_id: 'em_uma_visão_de_perfil_como_se_classifica_essa_face',
              linked_awnswer: 'Padrão II (Classe II esquelética)',
              type: 'select',
              options: [
                'Lábio superior protruso',
                'Lábio superior reto',
                'Lábio superior retruso',
              ],
            },
            children: [
              {
                field: {
                  id: 'o_lábio_superior_é_protruso_agora_assinale_qual_a_relação_do_lábio_inferior_com_o_mento',
                  label:
                    'O Lábio superior é protruso. Agora assinale qual a relação do Lábio inferior com o mento?',
                  linked_id:
                    'qual_a_relação_do_lábio_superior_com_o_filtro_subnásio',
                  linked_awnswer: 'Lábio superior protruso',
                  type: 'select',
                  options: [
                    'Lábio inferior reto',
                    'Lábio inferior protruso',
                    'Lábio inferior retruso',
                    'Mento retruso',
                  ],
                },
              },
              {
                field: {
                  id: 'o_lábio_superior_é_reto_agora_assinale_qual_a_relação_do_lábio_inferior_com_o_mento_2',
                  label:
                    'O Lábio superior é reto. Agora assinale qual a relação do Lábio inferior com o mento?',
                  linked_id:
                    'qual_a_relação_do_lábio_superior_com_o_filtro_subnásio',
                  linked_awnswer: 'Lábio superior reto',
                  type: 'select',
                  options: [
                    'Lábio inferior reto',
                    'Lábio inferior protruso',
                    'Lábio inferior retruso',
                    'Mento retruso',
                  ],
                },
              },
              {
                field: {
                  id: 'o_lábio_superior_é_retruso_agora_assinale_qual_a_relação_do_lábio_inferior_com_o_mento',
                  label:
                    'O Lábio superior é retruso. Agora assinale qual a relação do Lábio inferior com o mento?',
                  linked_id:
                    'qual_a_relação_do_lábio_superior_com_o_filtro_subnásio',
                  linked_awnswer: 'Lábio superior retruso',
                  type: 'select',
                  options: [
                    'Lábio inferior reto',
                    'Lábio inferior protruso',
                    'Lábio inferior retruso',
                    'Mento retruso',
                  ],
                },
              },
            ],
          },
          {
            field: {
              id: 'qual_a_relação_do_lábio_superior_com_o_filtro_subnásio_2',
              label: 'Qual a relação do Lábio superior com o Filtro/Subnásio?',
              linked_id: 'em_uma_visão_de_perfil_como_se_classifica_essa_face',
              linked_awnswer: 'Padrão III (Classe III esquelética)',
              type: 'select',
              options: [
                'Lábio superior reto',
                'Lábio superior retruso',
                'Lábio superior protruso',
              ],
            },
            children: [
              {
                field: {
                  id: 'o_lábio_superior_é_reto_agora_assinale_qual_a_relação_do_lábio_inferior_com_o_mento_',
                  label:
                    'O Lábio superior é reto. Agora assinale qual a relação do Lábio inferior com o mento?',
                  linked_id:
                    'qual_a_relação_do_lábio_superior_com_o_filtro_subnásio_2',
                  linked_awnswer: 'Lábio superior reto',
                  type: 'select',
                  options: [
                    'Lábio inferior reto',
                    'Lábio inferior protruso',
                    'Lábio inferior retruso',
                    'Mento retruso',
                  ],
                },
              },
              {
                field: {
                  id: 'o_lábio_superior_é_retruso_agora_assinale_qual_a_relação_do_lábio_inferior_com_o_mento_2',
                  label:
                    'O Lábio superior é retruso. Agora assinale qual a relação do Lábio inferior com o mento?',
                  linked_id:
                    'qual_a_relação_do_lábio_superior_com_o_filtro_subnásio_2',
                  linked_awnswer: 'Lábio superior retruso',
                  type: 'select',
                  options: [
                    'Lábio inferior reto',
                    'Lábio inferior protruso',
                    'Lábio inferior retruso',
                    'Mento retruso',
                  ],
                },
              },
              {
                field: {
                  id: 'o_lábio_superior_é_protruso_agora_assinale_qual_a_relação_do_lábio_inferior_com_o_mento_2',
                  label:
                    'O Lábio superior é protruso. Agora assinale qual a relação do Lábio inferior com o mento?',
                  linked_id:
                    'qual_a_relação_do_lábio_superior_com_o_filtro_subnásio_2',
                  linked_awnswer: 'Lábio superior protruso',
                  type: 'select',
                  options: [
                    'Lábio inferior reto',
                    'Lábio inferior protruso',
                    'Lábio inferior retruso',
                    'Mento retruso',
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    section: [
      {
        field: {
          id: 'em_qual_fase_da_dentição_ele_se_encontra',
          label: 'Em qual fase da dentição ele se encontra?',
          type: 'select',
          options: [
            'Dentição Decídua',
            'Dentição Mista',
            'Dentição Permanente',
          ],
        },
        children: [
          {
            field: {
              id: 'dentição_mista',
              label: 'Dentição Mista',
              linked_id: 'em_qual_fase_da_dentição_ele_se_encontra',
              linked_awnswer: 'Dentição Decídua',
              type: 'select',
              options: [
                'Dentição Mista - 1º período transitório',
                'Dentição Mista - período intertransitório',
                'Dentição Mista - 2º período transitório (fora do surto de cresciemnto)',
                'Dentição Mista - 2º período transitório (dentro do surto de cresciemnto)',
              ],
            },
          },
          {
            field: {
              id: 'dentição_mista_213',
              label: 'Dentição Mista',
              linked_id: 'em_qual_fase_da_dentição_ele_se_encontra',
              linked_awnswer: 'Dentição Mista',
              type: 'select',
              options: [
                'Dentição Mista - 1º período transitório',
                'Dentição Mista - período intertransitório',
                'Dentição Mista - 2º período transitório (fora do surto de cresciemnto)',
                'Dentição Mista - 2º período transitório (dentro do surto de cresciemnto)',
              ],
            },
          },
          {
            field: {
              id: 'dentição_permanente',
              label: 'Dentição Permanente',
              linked_id: 'em_qual_fase_da_dentição_ele_se_encontra',
              linked_awnswer: 'Dentição Permanente',
              type: 'select',
              options: [
                'Dentição permanente (Ortopédico)',
                'Dentição permanente (Ortodôntico)',
                'Dentição permanente (Orto-cirúrgico)',
              ],
            },
          },
        ],
      },
    ],
  },
];
