import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";
import FileSaver from "file-saver";

export default function Prediction({ prediction }) {
  const [url, setUrl] = useState(null);
  const [open, setOpen] = useState(false);

  function getTempOutput(prediction) {
    if (typeof prediction.output == "string") {
      return prediction.output;
    }
    if (prediction.output) {
      return prediction.output[prediction.output.length - 1];
    }
  }

  async function getOutput(prediction) {
    const url = `https://ennwjiitmiqwdrgxkevm.supabase.co/storage/v1/object/public/images/public/${prediction.id}.png`;
    let response = await fetch(url);

    if (response.status == 200) {
      setUrl(url);
      return url;
    } else {
      const tempUrl = getTempOutput(prediction);
      setUrl(tempUrl);
      return tempUrl;
    }
  }

  useEffect(() => {
    getOutput(prediction);
  }, [prediction]);

  return (
    <div
      className={`h-44 w-44 sm:h-52 sm:w-52 aspect-square group relative`}
      key={prediction.id}
    >
      {prediction.output && url && (
        <>
          <div>
            <button
              onClick={() => setOpen(true)}
              className="image-wrapper rounded-lg hover:opacity-75"
            >
              <img
                src={url}
                alt="output"
                className={`rounded-xl aspect-square`}
                loading="lazy"
              />
            </button>
          </div>

          <Save
            open={open}
            setOpen={setOpen}
            prediction={prediction}
            url={url}
          />
        </>
      )}

      {!prediction.output && prediction.error && (
        <div className="border border-gray-300 py-3 text-sm opacity-50 flex items-center justify-center aspect-square rounded-lg">
          <span className="mx-12">{prediction.error}</span>
        </div>
      )}

      {!prediction.output && !prediction.error && (
        <div className="border border-gray-300 py-3 text-sm opacity-50 flex items-center justify-center aspect-square rounded-lg">
          <Counter />
        </div>
      )}
    </div>
  );
}

const Counter = () => {
  const [tenthSeconds, setTenthSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTenthSeconds((tenthSeconds) => tenthSeconds + 1);
    }, 100); // now the interval is 100ms, so it increases every tenth of a second

    // cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // passing an empty array as the second argument to useEffect makes it run only on mount and unmount

  return (
    <div>
      <time
        className="tabular-nums"
        dateTime={`PT${(tenthSeconds / 10).toFixed(1)}S`}
      >
        {(tenthSeconds / 10).toFixed(1)}s
      </time>
    </div>
  );
};

export function Save({ open, setOpen, prediction, url }) {
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
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm mx-auto sm:p-6">
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
                    <img
                      src={url}
                      alt="output"
                      className="rounded-xl"
                      loading="lazy"
                    />
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
