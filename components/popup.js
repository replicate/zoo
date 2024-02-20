import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { XMarkIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";

export default function Popup({ open, setOpen }) {
  const handleClose = () => {
    localStorage.setItem("hasClosedPopup", true);
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
    localStorage.setItem("replicate_api_token", e.target[0].value);
    setOpen(false);
  };
  return (
    <Transition.Root show={false} as={Fragment}>
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
                      Welcome to the Zoo
                    </Dialog.Title>

                    <div className="mt-6">
                      <p className="text-base text-gray-500">
                        Grab your{" "}
                        <Link href="https://replicate.com/account/api-tokens?utm_campaign=zoo-diy&utm_source=project">
                          Replicate API token
                        </Link>{" "}
                        and paste it here:
                      </p>

                      <form onSubmit={handleSubmit}>
                        <label htmlFor="api-key" className="sr-only">
                          API Key
                        </label>
                        <input
                          type="text"
                          name="api-key"
                          id="api-key"
                          className="block mt-6 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="r8_..."
                        />
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 sm:col-start-2"
                          >
                            Start making images
                          </button>
                          <button
                            onClick={() => handleClose()}
                            className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          >
                            What is Replicate?
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
