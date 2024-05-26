import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';

import { HiXCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { paths } from '../../paths';

interface SidebarDialogProps {
  isOpen: boolean;
  handleClose: () => void;
}

export function SidebarDialog({ isOpen, handleClose }: SidebarDialogProps) {
  return (
    <Transition show={isOpen}>
      <Dialog className="relative z-40 lg:hidden" onClose={handleClose}>
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
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel className="relative mr-auto flex h-full w-full max-w-[250px] flex-col overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => handleClose()}
                >
                  <span className="sr-only">Close menu</span>
                  <HiXCircle className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 border-t border-gray-200">
                <ul
                  role="list"
                  className="px-2 py-3 text-gray-900 dark:text-gray-200"
                >
                  {paths.map(
                    path =>
                      !!path.path && (
                        <li key={path.label}>
                          <Link
                            to={path.path}
                            onClick={() => handleClose()}
                            className="flex items-center px-2 my-2 hover:bg-gray-700 active:bg-gray-700 rounded-md"
                          >
                            <path.icon className="h-6 w-6 text-gray-400" />
                            <span className="block px-2 py-3">
                              {path.label}
                            </span>
                          </Link>
                        </li>
                      ),
                  )}
                </ul>

                {/*       {filters.map(section => (
              <Disclosure
                as="div"
                key={section.id}
                className="border-t border-gray-200 px-4 py-6"
              >
                {({ open }) => (
                  <>
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          {open ? (
                            <HiXCircle
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <HiXCircle
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div
                            key={option.value}
                            className="flex items-center"
                          >
                            <input
                              id={`filter-mobile-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              defaultValue={option.value}
                              type="checkbox"
                              defaultChecked={option.checked}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="ml-3 min-w-0 flex-1 text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            ))} */}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
