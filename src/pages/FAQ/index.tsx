import { Accordion } from 'flowbite-react';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';

export function FAQ() {
  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-2xl lg:py-8 lg:px-6">
        <div className="max-w-screen-2xl text-gray-500 sm:text-lg dark:text-gray-400">
          <div className="px-3 sm:px-5 mx-auto">
            <h2 className="my-4 text-4xl tracking-tight font-bold text-gray-800 dark:text-white">
              FAQ
            </h2>
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <Accordion>
                <Accordion.Panel>
                  <Accordion.Title>
                    TERMOS DE USO — DOCTOR ORTHO
                  </Accordion.Title>
                  <Accordion.Content>
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
                  </Accordion.Content>
                </Accordion.Panel>
                <Accordion.Panel>
                  <Accordion.Title>
                    Política de Privacidade – Doctor Orthor
                  </Accordion.Title>
                  <Accordion.Content>
                    <div className="h-full">
                      <DocViewer
                        pluginRenderers={DocViewerRenderers}
                        documents={[
                          {
                            uri: 'https://firebasestorage.googleapis.com/v0/b/doctorortho-a02ef.appspot.com/o/Poli%CC%81tica%20de%20Privacidade%20Padra%CC%83o.docx?alt=media&token=58fe37e3-7746-4d0d-b169-bab0c24dfbe5',
                            fileType: 'docx',
                          },
                        ]}
                        style={{ height: 1180 }}
                      />
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
