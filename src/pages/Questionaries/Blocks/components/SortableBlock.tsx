import { Dropdown } from 'flowbite-react';
import { HiDotsVertical, HiOutlineSwitchVertical } from 'react-icons/hi';
import { Button } from '../../../../components/Button';
import { BlockType } from '../../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';

interface SortableBlockProps {
  block: BlockType;
  onSelectBlockToEdit: (block: BlockType) => void;
  onSelectBlockToDelete: (block: BlockType) => void;
}

export function SortableBlock({
  block,
  onSelectBlockToDelete,
  onSelectBlockToEdit,
}: SortableBlockProps) {
  const navigate = useNavigate();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      style={style}
      className="flex justify-between gap-x-1 py-5 cursor-default"
    >
      <div className="flex items-center min-w-0 gap-x-4">
        <div
          className="border border-gray-200 dark:border-gray-600 rounded p-1 cursor-pointer"
          {...listeners}
        >
          <HiOutlineSwitchVertical className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200">
            {block.name}
          </p>
          <time className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400 flex-wrap">
            {`Atualizado em  ${new Date(
              block.updated_at,
            ).toLocaleDateString()} às ${new Date(
              block.updated_at,
            ).toLocaleTimeString()}`}
          </time>
        </div>
      </div>
      <div className="shrink-0 flex items-center">
        <Button
          color="light"
          onClick={() => navigate(`/questions?block_id=${block.id}`)}
        >
          Questões
        </Button>
        <Dropdown
          label="User menu dropdown"
          renderTrigger={() => (
            <button
              type="button"
              className="px-0 py-2.5 border-0 ml-2 focus:ring-0 "
              id="user-menu-button"
              aria-expanded="false"
            >
              <HiDotsVertical className="w-5 h-5" />
            </button>
          )}
        >
          <Dropdown.Item onClick={() => onSelectBlockToEdit(block)}>
            Editar
          </Dropdown.Item>
          <Dropdown.Item onClick={() => onSelectBlockToDelete(block)}>
            Deletar
          </Dropdown.Item>
        </Dropdown>
      </div>
    </li>
  );
}
