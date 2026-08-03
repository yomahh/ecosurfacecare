import PageHero from "../components/ui/PageHero";
export default function Accessibility() {
  return (
    <>
      <PageHero eyebrow="Legal information" title="Accessibility Statement" text="This starter page must be reviewed and completed with the company’s final legal and operational details before launch." />
      <section className="section-space"><div className="container-site max-w-4xl prose prose-slate"><h2>Overview</h2><p className="leading-8 text-slate-600">Explain the steps taken to make the website usable with keyboard navigation, readable contrast, meaningful labels and alternative text.</p><h2 className="mt-8 text-2xl font-bold">Information to confirm</h2><p className="mt-3 leading-8 text-slate-600">Business address, data controller contact details, retention periods, service terms and any third-party services should be confirmed before publication.</p></div></section>
    </>
  );
}
