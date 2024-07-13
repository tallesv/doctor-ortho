import { DocMenu } from '../../components/DocMenu';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';

export function Terms() {
  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-2xl lg:py-8 lg:px-6">
        <div className="max-w-screen-2xl text-gray-500 sm:text-lg dark:text-gray-400">
          <div className="px-3 sm:px-5 mx-auto">
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div className="flex justify-between">
                <div>
                  <DocMenu />
                </div>
                <div className="flex-grow">
                  <DocViewer
                    pluginRenderers={DocViewerRenderers}
                    documents={[
                      {
                        uri: 'https://firebasestorage.googleapis.com/v0/b/doctorortho-a02ef.appspot.com/o/Termos%20de%20Uso%20Padra%CC%83o.docx?alt=media&token=8b33ab36-aeac-43df-b071-21542e9a9676',
                        fileType: 'docx',
                      },
                    ]}
                    style={{ height: 1180 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
