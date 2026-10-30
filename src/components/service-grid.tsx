import Link from 'next/link';
import {
  ArrowUpRight,
  Sparkles,
  Code2,
  Layers3,
  Cloud,
  Cpu,
  Radio,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { services } from '@/data/content';
const icons = {
  sparkles: Sparkles,
  code: Code2,
  layers: Layers3,
  cloud: Cloud,
  cpu: Cpu,
  radio: Radio,
  shield: ShieldCheck,
  users: Users,
};
export function ServiceGrid() {
  return (
    <div className="service-grid">
      {services.map((s, i) => {
        const Icon = icons[s.icon];
        return (
          <Link
            className="service-card"
            href={`/services/${s.slug}/`}
            key={s.slug}
          >
            <div className="service-card-top">
              <Icon size={26} strokeWidth={1.3} />
              <span>0{i + 1}</span>
            </div>
            <h3>{s.name}</h3>
            <p>{s.description}</p>
            <div className="card-bottom">
              <span>{s.tags[0]}</span>
              <ArrowUpRight size={22} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
