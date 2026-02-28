// Ferrari Macarena Wing - Rotating Rear Wing Analysis
const projectFerrariMacarenaWing = {
  id: 'ferrari-macarena-wing',
  category: 'External aero',
  parallaxSpeed: 0.25,

  media: {
    type: 'gallery',
    images: [
      { src: 'projects/figs/Ferrari_Final_video.mp4', alt: 'Ferrari Macarena Wing: 180° rotation animation showing aerodynamic loading throughout rotation arc'},
      {  src: 'projects/figs/Ferrari_hysteresis_plot.jpg', alt: 'Ferrari Macarena Wing: Hysteresis plot showing aerodynamic hysteresis throughout rotation arc'}
    ]
  },

  title: 'Ferrari\'s "Macarena Wing": Engineering the 180° Rotating Rear Wing',
  meta: ['Analytical', 'F1'],
  role: 'Role: aerodynamic & structural assessment of rotating wing concept',

  description: `Engineering analysis of Ferrari's controversial rotating rear wing concept that
    rotates 180° for straight-line performance. Evaluation of aerodynamic gains, structural
    loading during mid-rotation, and handling compromises that determine circuit-specific viability.`,

  tags: ['F1', 'Rear wing', 'Drag reduction', 'Vortex shedding', 'Aeroelastics'],

  details: `
    <p><strong>Background:</strong> Ferrari introduced a rotating rear wing concept rumoured to deliver 8–10 km/h of additional top speed while remaining within FIA regulations. Unlike conventional DRS, the entire wing rotates 180°, presenting novel aerodynamic and structural challenges throughout the rotation arc.</p>

    <p><strong>Aerodynamic challenges:</strong></p>
    <ul>
      <li><strong>Mid-rotation drag spike:</strong> At ~90° rotation the wing presents maximum frontal area to the flow, creating a significant transient drag peak the car must accelerate through</li>
      <li><strong>Flow separation:</strong> Mid-rotation geometry generates strong flow separation on both pressure and suction surfaces simultaneously</li>
      <li><strong>Vortex shedding:</strong> Separated flow produces intense oscillatory loads at frequencies that shift continuously as car decelerates during braking</li>
      <li><strong>Resonance risk:</strong> The sweeping excitation frequency spectrum may cross structural natural frequencies, creating unpredictable resonance across braking events</li>
    </ul>

    <p><strong>Structural tradeoffs:</strong></p>
    <ul>
      <li>Maximum structural loads occur at ~90° — precisely where aerodynamic loading is least predictable</li>
      <li>Withstanding transient drag spikes and oscillatory vortex shedding forces requires a stiffer, heavier structure</li>
      <li>Additional mass at the rear wing raises the centre of gravity, increasing rear lateral load transfer</li>
      <li>Higher lateral load transfer reduces rear grip margin, particularly under combined braking and cornering</li>
    </ul>

    <p><strong>Handling implications:</strong></p>
    <ul>
      <li>Raised rear CoG compromises cornering balance on high-speed, high-downforce circuits</li>
      <li>Transient stability during wing rotation may affect driver confidence in DRS zones approaching corners</li>
      <li>Trade-off is most acceptable at low-downforce circuits where cornering sensitivity is reduced</li>
    </ul>

    <p><strong>Strategic deployment assessment:</strong></p>
    <ul>
      <li><strong>Favourable circuits:</strong> Monza (Temple of Speed), Baku — low downforce, long straights, minimal high-speed corners</li>
      <li><strong>Unfavourable circuits:</strong> Silverstone, Spa, Suzuka — high-speed corner dependency makes rear CoG sensitivity costly</li>
      <li>An 8–10 km/h top speed gain is decisive at Monza; worth little if cornering balance suffers at Suzuka</li>
    </ul>

    <p><strong>Conclusion:</strong> The Macarena wing is an elegant regulation exploit, but a circuit-specific weapon. The structural mass penalty and oscillatory load environment during rotation create real handling compromises that limit universal deployment. Ferrari will likely use it selectively where straight-line speed trumps cornering balance.</p>
  `,

  footer: {
    label: '8–10 km/h top speed gain: worth the structural and handling cost?',
    links: [
      { text: 'LinkedIn post', href: 'https://www.linkedin.com/posts/dominik-balasko_formula1-aerodynamics-cfd-activity-7432696163696443392-KOuh', external: true }
    ]
  }
};
