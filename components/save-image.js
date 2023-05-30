import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import FileSaver from "file-saver";

export function SaveImage({ open, setOpen, prediction, url, annotatedUrl = false }) {
  const download = async (url, id) => {
    FileSaver.saveAs(url, `${id}.png`);
  };

  return (
    <Transition.Root show={open} as={Fragment} appear>
      <Dialog
        autoFocus={false}
        as="div"
        className="relative z-10"
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-60 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20 mt-8 sm:mt-32">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className={`relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full ${annotatedUrl ? 'sm:max-w-3xl' : 'sm:max-w-sm'} mx-auto sm:p-6`}>
              <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div>
                <div className="">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Zoo Prediction
                  </Dialog.Title>
                  <div className="mt-4">

                    {annotatedUrl ? (
                      <div className="grid grid-cols-3 mt-4 gap-x-4">
                        <div>
                          <h1 className="text-sm pb-2 font-medium text-gray-500">
                            Input
                          </h1>
                          <img
                            src={prediction.control_image}
                            alt="Input"
                            className="rounded-xl w-64"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <h1 className="text-sm pb-2 font-medium text-gray-500">
                            Edge
                          </h1>
                          <img
                            src={annotatedUrl}
                            alt="Edge"
                            className="rounded-xl w-64"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <h1 className="text-sm pb-2 font-medium text-gray-500">
                            Output
                          </h1>
                          <img
                            src={url}
                            alt="Output"
                            className="rounded-xl w-64"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={url}
                        alt="output"
                        className="rounded-xl"
                        loading="lazy"
                      />
                    )}

                  </div>
                  <div>
                    <p className="mt-4 block truncate text-sm font-medium text-gray-900">
                      {prediction.model}
                    </p>
                    <p className="block text-sm font-medium text-gray-500">
                      {prediction.input.prompt}
                    </p>

                    {prediction.metrics && (
                      <p className="mt-2 text-xs text-gray-500">
                        Predict time:{" "}
                        {prediction.metrics && prediction.metrics.predict_time}s
                      </p>
                    )}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={url}
                      className="mt-4 mr-2 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Open Link
                    </a>
                    <button
                      onClick={() => download(url)}
                      className="mt-4 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Download Image
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default SaveImage;
