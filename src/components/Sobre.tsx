import React, { useState } from 'react';

export const Sobre: React.FC = () => {
  const [downloading, setDownloading] = useState(false);

  const downloadPdf = async () => {
    const pdfUrl = '/assets/portifolio_gfrio.pdf';
    const pdfName = 'portifolio_gfrio.pdf';

    try {
      setDownloading(true);
      const response = await fetch(pdfUrl);
      const fileBlob = await response.blob();
      const blob = new Blob([fileBlob], { type: 'application/pdf' });
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = pdfName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadURL);
    } catch {
      window.open(pdfUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section
      id="sobre"
      className="about-section"
      aria-labelledby="about-heading"
    >
      <div className="section-shell">
        <div className="about-layout">
          <div className="about-layout__visual">
            <div className="about-layout__image-frame">
              <img
                src="/assets/epis.jpg"
                alt="Equipe técnica e segurança operacional GFRIO"
                className="about-layout__field-img"
                loading="lazy"
                decoding="async"
                width={520}
                height={460}
              />
              <div className="about-layout__badge">
                <img
                  src="/assets/logo.jpg"
                  alt="Logo da GFRIO Refrigeração Comercial"
                  className="about-layout__badge-logo"
                  loading="lazy"
                  decoding="async"
                  width={72}
                  height={48}
                />
                <div className="about-layout__badge-copy">
                  <strong>Equipe Habilitada</strong>
                  <span>Capacitação direta pelos fabricantes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="about-layout__content">
            <span className="section-kicker">Nossa Trajetória</span>
            <h2
              id="about-heading"
              className="section-heading section-heading--light"
            >
              Sobre a GFRIO
            </h2>

            <div className="about-layout__prose">
              <p>
                Fundada por um jovem técnico especializado no segmento de
                refrigeração, conseguindo realizar um grande sonho. A empresa se
                destaca pela qualidade dos seus serviços e pelo comprometimento
                com os seus clientes. Com experiência na área de refrigeração, o
                fundador da GFRIO percebeu a necessidade de oferecer um serviço
                diferenciado.
              </p>
              <p>
                A nossa equipe técnica é formada por profissionais habilitados e
                extremamente capacitados através dos fabricantes de equipamentos
                que atuamos em nosso segmento, estamos sempre buscando
                aprimoramento e atualizações referente a novas tecnologias do
                setor de refrigeração e climatização, buscando soluções
                eficientes e personalizadas para cada cliente.
              </p>
              <p>
                A empresa oferece serviços de projetos, instalação e manutenção
                em equipamentos residenciais, comerciais e industriais,
                atendendo ao mercado de refrigeração, climatização, ventilação,
                exaustão e hospitalar, com qualidade e pronto atendimento.
              </p>
            </div>

            <div
              className="about-layout__sectors"
              aria-label="Segmentos atendidos"
            >
              <span>Residencial</span>
              <span>Comercial</span>
              <span>Industrial</span>
              <span>Ventilação e Exaustão</span>
              <span>Hospitalar e Salas Limpas</span>
            </div>

            <div className="about-layout__actions">
              <button
                type="button"
                className="btn-industrial btn-industrial--accent"
                onClick={downloadPdf}
                disabled={downloading}
              >
                <i
                  className="bi bi-file-earmark-arrow-down"
                  aria-hidden="true"
                />
                <span>
                  {downloading
                    ? 'Preparando arquivo...'
                    : 'Baixar Portfólio Técnico (PDF)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
