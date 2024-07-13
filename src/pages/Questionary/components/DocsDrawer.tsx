import { docsItens } from '../../../components/DocMenu';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';

import { HiXCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

interface DocsDrawerProps {
  isOpen: boolean;
  handleClose: () => void;
}

export function DocsDrawer({ isOpen, handleClose }: DocsDrawerProps) {
  return (
    <Transition show={isOpen}>
      <Dialog className="relative z-40" onClose={handleClose}>
        <TransitionChild
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 z-40 flex">
          <TransitionChild
            enter="transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="relative ml-auto flex h-full w-full max-w-[250px] flex-col overflow-y-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between mt-20 px-4">
                <div className="font-bold text-xl text-gray-900 dark:text-gray-300">
                  Docs
                </div>
                <button
                  type="button"
                  className="-ml-2 flex h-10 w-10 items-center justify-center rounded-md  p-2 text-gray-400"
                  onClick={handleClose}
                >
                  <span className="sr-only">Close menu</span>
                  <HiXCircle className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 border-t border-gray-200 dark:border-gray-700">
                <ul
                  role="list"
                  className="px-2 py-3 text-gray-900 dark:text-gray-200"
                >
                  {docsItens.map(
                    item =>
                      !!item.path && (
                        <li key={item.label}>
                          <Link
                            to={item.path}
                            onClick={handleClose}
                            className="flex items-center px-2 my-2 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-700 rounded-md"
                          >
                            <span className="block px-2 py-3">
                              {item.label}
                            </span>
                          </Link>
                        </li>
                      ),
                  )}
                </ul>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
