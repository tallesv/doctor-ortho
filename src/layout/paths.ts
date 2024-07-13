import {
  HiUser,
  HiPencilAlt,
  HiOutlinePencil,
  HiDocumentText,
} from 'react-icons/hi';
type Path = {
  label: string;
  path?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  children?: {
    label: string;
    path: string;
  }[];
};

export const paths: Path[] = [
  /*  {
    label: 'Dashboard',
    path: '/',
    icon: HiChartPie,
  },
  {
    label: 'Produtos',
    icon: HiShoppingBag,
    children: [
      {
        label: 'Produto 1',
        path: '/',
      },
      {
        label: 'Produto 2',
        path: '/',
      },
    ],
  }, */
  {
    label: 'Questionário',
    path: '/questionary',
    icon: HiPencilAlt,
  },
  {
    label: 'Editar Questionário',
    path: '/blocks',
    icon: HiOutlinePencil,
  },
  {
    label: 'Tratamentos',
    path: '/treatments-table',
    icon: HiDocumentText,
  },
  {
    label: 'Usuários',
    path: '/users',
    icon: HiUser,
  },
];
