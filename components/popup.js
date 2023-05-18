import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { XMarkIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";

export default function Popup({ open, setOpen }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-semibold leading-6 text-gray-900"
                    >
                      Want to build your own Zoo?
                    </Dialog.Title>

                    <Image
                      width={250}
                      height={250}
                      className="mx-auto"
                      src="https://ennwjiitmiqwdrgxkevm.supabase.co/storage/v1/object/public/images/public/2370caef-bc8c-423e-88bb-0ca4a71e19c8.png"
                      alt=""
                      unoptimized={true}
                    />
                    <div className="mt-2">
                      <p className="text-base text-gray-500">
                        Check out the repo to see how to build this yourself.
                        Or, try running a model on Replicate, an API for machine
                        learning models.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <Link
                    href="https://replicate.com?utm_source=project&utm_campaign=zoo"
                    className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 sm:col-start-2"
                    onClick={() => setOpen(false)}
                  >
                    Try Replicate
                  </Link>
                  <Link
                    href="https://github.com/replicate/zoo?utm_source=project&utm_campaign=zoo"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => setOpen(false)}
                  >
                    Fork on GitHub
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
