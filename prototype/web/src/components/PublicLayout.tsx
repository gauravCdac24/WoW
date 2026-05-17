import { Outlet } from "react-router-dom";
import { ParticleBackground } from "./ParticleBackground";
import { PublicTopNav } from "./PublicTopNav";

export function PublicLayout() {
  return (
    <div className="public-layout">
      <ParticleBackground />
      <PublicTopNav />
      <div className="public-content">
        <Outlet />
      </div>
    </div>
  );
}
