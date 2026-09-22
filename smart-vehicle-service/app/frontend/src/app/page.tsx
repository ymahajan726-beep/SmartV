const services = [
  { title: "Periodic service", detail: "Precision checks, fluids, filters, and a clear health report.", price: "From Rs 1,499" },
  { title: "Brake care", detail: "Inspection and replacement by trained technicians using quality parts.", price: "From Rs 799" },
  { title: "AC and diagnostics", detail: "Find the fault quickly with modern diagnostics and transparent estimates.", price: "From Rs 599" },
];

const steps = ["Tell us about your car", "Choose a trusted service center", "Track every update in one place"];

export default function Home() {
  return (
    <main className="site-shell">
      <nav className="nav container"><a className="brand" href="/">MOTOR<span>CARE</span></a><div className="nav-links"><a href="#services">Services</a><a href="#how-it-works">How it works</a><a href="#centers">Service centers</a></div><a className="button button-dark" href="/login">Sign in <span>↗</span></a></nav>
      <section className="hero container"><div className="hero-copy"><p className="eyebrow">VEHICLE CARE, WITHOUT THE GUESSWORK</p><h1>Your car deserves a <em>better</em> service day.</h1><p className="hero-text">Book verified technicians, follow the work as it happens, and keep your vehicle ready for every road ahead.</p><div className="hero-actions"><a className="button button-accent" href="/register">Book a service <span>↗</span></a><a className="text-link" href="#how-it-works">See how it works <span>↓</span></a></div><div className="trust-row"><strong>4.9/5</strong><span>average customer rating</span><i /><strong>12k+</strong><span>cars cared for</span></div></div><div className="hero-art" aria-label="Illustration of a serviced vehicle"><div className="sun" /><div className="road" /><div className="car"><div className="window" /><div className="hood" /><div className="wheel wheel-one" /><div className="wheel wheel-two" /></div><div className="service-tag">NEXT AVAILABLE<br /><b>Today, 4:30 PM</b></div></div></section>
      <section className="marquee"><div className="container marquee-inner"><span>YOUR ROUTINE, RUNNING SMOOTHLY</span><span>●</span><span>REAL TECHNICIANS</span><span>●</span><span>REAL UPDATES</span><span>●</span><span>REAL PEACE OF MIND</span></div></section>
      <section id="services" className="section container"><div className="section-heading"><div><p className="eyebrow">WHAT WE DO</p><h2>Care that goes<br /><em>under the hood.</em></h2></div><p>From a quick inspection to a complete service, every job is handled with the same attention your car gets from you.</p></div><div className="service-grid">{services.map((service, index) => <article className="service-card" key={service.title}><span className="card-number">0{index + 1}</span><h3>{service.title}</h3><p>{service.detail}</p><footer><span>{service.price}</span><a href="/register" aria-label={`Book ${service.title}`}>↗</a></footer></article>)}</div></section>
      <section id="how-it-works" className="dark-band"><div className="container process"><div><p className="eyebrow light">THE SIMPLE WAY</p><h2>Less time in the garage.<br /><em>More time on the road.</em></h2></div><div className="step-list">{steps.map((step, index) => <div className="step" key={step}><span>0{index + 1}</span><p>{step}</p></div>)}</div></div></section>
      <section id="centers" className="location container"><div><p className="eyebrow">FIND YOUR CREW</p><h2>Good care is<br /><em>closer than you think.</em></h2></div><div className="location-panel"><div><span className="pin">⌖</span><p><strong>Find a service center</strong><br />Enter your city to see available slots.</p></div><a className="button button-accent" href="/register">Explore centers <span>↗</span></a></div></section>
      <footer className="footer"><div className="container footer-inner"><a className="brand" href="/">MOTOR<span>CARE</span></a><p>Built for the roads you choose.</p><span>© 2026 Motorcare</span></div></footer>
    </main>
  );
}
