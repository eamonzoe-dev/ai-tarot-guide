export type RitualCoreV2State = "breath" | "settle" | "ready" | "focus";

type RitualCoreV2Props = {
  pulseCount: number;
  state: RitualCoreV2State;
};

export function RitualCoreV2({ pulseCount, state }: RitualCoreV2Props) {
  const farParticles = Array.from({ length: 32 }, (_, index) => index + 1);
  const midParticles = Array.from({ length: 18 }, (_, index) => index + 1);
  const nearParticles = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <div
      className={`ritual-core-v2 ritual-core-v2-${state}`}
      aria-hidden="true"
    >
      <div
        key={`ritual-shell-${pulseCount}`}
        className={`ritual-core-v2-shell ${
          pulseCount > 0 ? "ritual-core-v2-shell-pulse" : ""
        }`}
      >
        <div className="ritual-core-v2-depth ritual-core-v2-depth-a" />
        <div className="ritual-core-v2-depth ritual-core-v2-depth-b" />
        <div className="ritual-core-v2-axis ritual-core-v2-axis-x" />
        <div className="ritual-core-v2-axis ritual-core-v2-axis-y" />
        <div className="ritual-core-v2-center" />
        <div className="ritual-core-v2-center-ring ritual-core-v2-center-ring-a" />
        <div className="ritual-core-v2-center-ring ritual-core-v2-center-ring-b" />
        <div className="ritual-core-v2-orbit ritual-core-v2-orbit-a" />
        <div className="ritual-core-v2-orbit ritual-core-v2-orbit-b" />
        <div className="ritual-core-v2-orbit ritual-core-v2-orbit-c" />
        <div className="ritual-core-v2-orbit ritual-core-v2-orbit-d" />
        <div className="ritual-core-v2-orbit ritual-core-v2-orbit-e" />

        {farParticles.map((index) => (
          <span
            className={`ritual-core-v2-far ritual-core-v2-far-${index}`}
            key={`far-${index}`}
          />
        ))}

        {midParticles.map((index) => (
          <span
            className={`ritual-core-v2-mid ritual-core-v2-mid-${index}`}
            key={`mid-${index}`}
          />
        ))}

        {nearParticles.map((index) => (
          <span
            className={`ritual-core-v2-near ritual-core-v2-near-${index}`}
            key={`near-${index}`}
          />
        ))}
      </div>
      <div key={`ritual-wave-${pulseCount}`} className="ritual-core-v2-wave" />
    </div>
  );
}
