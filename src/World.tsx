import { useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Grid, Html, OrbitControls, Sparkles, Stars } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { locations, portfolio, type Location, type LocationId } from './data';

type WorldProps = {
  active: LocationId | null;
  mobile: boolean;
  reducedMotion: boolean;
  visible: boolean;
  theme: 'light' | 'dark';
  onSelect: (id: LocationId) => void;
  onReady: () => void;
};

const scenePalette = {
  dark: {
    accent: '#B6F09C',
    spots: { about: '#c5d4bd', projects: '#b6f09c', tech: '#d4d1bf', experience: '#a7c5ad', achievements: '#d6c7a0', contact: '#b5ccbe' },
    platform: '#1a201c', activePlatform: '#354436', platformTop: '#101512', identityBase: '#202a22', identityTop: '#131a15', sculpture: '#d7ddd2',
    project: ['#c9d3c3', '#adc6b0', '#c8cfbc', '#c4cbd2', '#d2d4c6'], projectGlow: '#314531',
    clear: '#090909', fog: '#090909', ambient: '#b3bdaf', sky: '#667a68', ground: '#090b09', key: '#e6e8d9', fill: '#597b5c', grid: '#1c2a1e', gridSection: '#344033',
  },
  light: {
    accent: '#526C42',
    spots: { about: '#657458', projects: '#526C42', tech: '#72694f', experience: '#536c5c', achievements: '#806d3e', contact: '#536c63' },
    platform: '#c9c4b8', activePlatform: '#b5bea9', platformTop: '#ded9cc', identityBase: '#c6c0b4', identityTop: '#e7e2d7', sculpture: '#70796a',
    project: ['#737c68', '#64775f', '#807b68', '#6c7780', '#827d6b'], projectGlow: '#788d67',
    clear: '#F1EEE8', fog: '#e5e0d5', ambient: '#fff8e8', sky: '#e5ead9', ground: '#898779', key: '#fff7e5', fill: '#8da37b', grid: '#c9c6b8', gridSection: '#aaa995',
  },
};

function Icon({ id, tint, theme }: { id: LocationId; tint: string; theme: 'light' | 'dark' }) {
  const material = <meshPhysicalMaterial color={tint} metalness={0.72} roughness={theme === 'light' ? 0.3 : 0.22} clearcoat={0.9} clearcoatRoughness={0.18} />;
  if (id === 'projects') {
    return <mesh rotation={[0.3, 0.2, 0]}>{material}<torusKnotGeometry args={[0.39, 0.105, 88, 12, 2, 3]} /></mesh>;
  }
  if (id === 'tech') {
    return <mesh rotation={[0.2, 0.5, 0]}>{material}<icosahedronGeometry args={[0.48, 1]} /></mesh>;
  }
  if (id === 'experience') {
    return <mesh rotation={[0.4, 0.1, 0]}>{material}<dodecahedronGeometry args={[0.45, 0]} /></mesh>;
  }
  if (id === 'achievements') {
    return <mesh rotation={[0.2, 0.2, 0]}>{material}<octahedronGeometry args={[0.5, 0]} /></mesh>;
  }
  if (id === 'contact') {
    return <mesh rotation={[0.75, 0.2, 0]}>{material}<torusGeometry args={[0.39, 0.07, 12, 60]} /></mesh>;
  }
  return <mesh rotation={[0.25, 0.3, 0]}>{material}<sphereGeometry args={[0.4, 20, 20]} /></mesh>;
}

function Station({ location, active, onSelect, theme }: { location: Location; active: boolean; onSelect: (id: LocationId) => void; theme: 'light' | 'dark' }) {
  const [hovered, setHovered] = useState(false);
  const root = useRef<THREE.Group>(null);
  const icon = useRef<THREE.Group>(null);
  const palette = scenePalette[theme];
  const tint = palette.spots[location.id];
  useFrame((_state, delta) => {
    if (root.current) {
      const target = active ? 1.12 : hovered ? 1.07 : 1;
      root.current.scale.lerp(new THREE.Vector3(target, target, target), 1 - Math.exp(-delta * 5));
    }
    if (icon.current) icon.current.rotation.y += delta * (hovered || active ? 0.22 : 0.045);
  });

  const select = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    onSelect(location.id);
  };

  return (
    <Float speed={1.1} rotationIntensity={0.035} floatIntensity={0.17} floatingRange={[-0.12, 0.15]}>
      <group ref={root} position={location.position}>
        <mesh receiveShadow position={[0, -0.33, 0]} rotation={[0, Math.PI / 6, 0]}
          onClick={select} onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}>
          <cylinderGeometry args={[1.38, 1.18, 0.36, 6, 1]} />
          <meshStandardMaterial color={active ? palette.activePlatform : palette.platform} metalness={theme === 'dark' ? 0.54 : 0.35} roughness={0.38} />
        </mesh>
        <mesh position={[0, -0.1, 0]} rotation={[0, Math.PI / 6, 0]} onClick={select}
          onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}>
          <cylinderGeometry args={[1.18, 1.18, 0.08, 6, 1]} />
          <meshStandardMaterial color={palette.platformTop} metalness={0.43} roughness={0.34} />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[1.02, active || hovered ? 0.025 : 0.012, 5, 72]} />
          <meshBasicMaterial color={tint} transparent opacity={active ? 0.8 : hovered ? 0.65 : 0.26} />
        </mesh>
        <group ref={icon} position={[0, 0.72, 0]} onClick={select}
          onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}>
          <Icon id={location.id} tint={tint} theme={theme} />
          <mesh rotation={[0.55, 0.35, 0]} scale={1.18}>
            <torusGeometry args={[0.58, 0.009, 4, 56]} />
            <meshBasicMaterial color={palette.accent} transparent opacity={active ? 0.62 : 0.24} />
          </mesh>
        </group>
        <mesh position={[0, 0.29, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.43, 8]} />
          <meshStandardMaterial color={tint} emissive={tint} emissiveIntensity={active ? 0.5 : 0.12} metalness={0.45} roughness={0.3} />
        </mesh>
        <pointLight position={[0, 1.2, 0]} color={tint} intensity={active ? 12 : hovered ? 8 : 3} distance={4.2} decay={2} />
        <Html position={[0, 1.57, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div className={'world-sign' + (active ? ' is-active' : '')}>
            <span>{location.glyph}</span>
            <strong>{location.title}</strong>
            <small>{location.subtitle}</small>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function Identity({ theme }: { theme: 'light' | 'dark' }) {
  const palette = scenePalette[theme];
  const group = useRef<THREE.Group>(null);
  useFrame((_state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.06;
  });
  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[1.8, 2, 0.34, 8]} />
        <meshStandardMaterial color={palette.identityBase} metalness={0.7} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[1.55, 1.55, 0.09, 8]} />
        <meshPhysicalMaterial color={palette.identityTop} metalness={0.75} roughness={0.18} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.64, 0.018, 5, 96]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.68} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <torusKnotGeometry args={[0.61, 0.11, 92, 12, 2, 3]} />
        <meshPhysicalMaterial color={palette.sculpture} metalness={0.78} roughness={theme === 'light' ? 0.28 : 0.2} clearcoat={0.9} />
      </mesh>
      <Html position={[0, 0.37, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <div className="identity-mark">
          <span>KHANAK</span>
          <small>JAIN / 2026</small>
        </div>
      </Html>
    </group>
  );
}

function ExhibitShape({ index }: { index: number }) {
  if (index === 0) return <torusKnotGeometry args={[0.27, 0.072, 56, 8, 2, 3]} />;
  if (index === 1) return <torusGeometry args={[0.32, 0.055, 10, 48]} />;
  if (index === 2) return <octahedronGeometry args={[0.34, 0]} />;
  if (index === 3) return <icosahedronGeometry args={[0.34, 1]} />;
  return <boxGeometry args={[0.44, 0.44, 0.44, 1, 1, 1]} />;
}

function ProjectArtifact({ index, position, title, active, onSelect, theme }: { index: number; position: [number, number, number]; title: string; active: boolean; onSelect: (id: LocationId) => void; theme: 'light' | 'dark' }) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const palette = scenePalette[theme];
  useFrame((_state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * (hovered ? 0.38 : 0.055);
    const scale = hovered ? 1.2 : 1;
    mesh.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 1 - Math.exp(-delta * 6));
  });
  const select = (event: { stopPropagation: () => void }) => { event.stopPropagation(); onSelect('projects'); };
  return (
    <Float speed={1.35} rotationIntensity={0.09} floatIntensity={0.23} floatingRange={[-0.2, 0.2]}>
      <group position={position}>
        <mesh ref={mesh} onClick={select}
          onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}>
          <ExhibitShape index={index} />
          <meshPhysicalMaterial color={palette.project[index]} metalness={0.72} roughness={theme === 'light' ? 0.28 : 0.2} clearcoat={0.85} emissive={palette.projectGlow} emissiveIntensity={hovered ? 0.24 : 0.035} />
        </mesh>
        <mesh rotation={[0.5 + index * 0.12, 0.2, 0]} scale={1.45}>
          <torusGeometry args={[0.38, 0.008, 4, 40]} />
          <meshBasicMaterial color={palette.accent} transparent opacity={hovered ? 0.72 : 0.28} />
        </mesh>
        <Html position={[0, 0.62, 0]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
          <span className={'artifact-label' + (active || hovered ? ' is-visible' : '')} aria-hidden={!active && !hovered}>{String(index + 1).padStart(2, '0')} / {title.toUpperCase()}</span>
        </Html>
      </group>
    </Float>
  );
}

function ProjectExhibits({ active, onSelect, theme }: { active: boolean; onSelect: (id: LocationId) => void; theme: 'light' | 'dark' }) {
  const exhibits = [
    { position: [-5.15, 0.6, -7.2] as [number, number, number] },
    { position: [-3.8, 0.9, -9.7] as [number, number, number] },
    { position: [-1.1, 0.7, -8.1] as [number, number, number] },
    { position: [-1.05, 0.65, -5.6] as [number, number, number] },
    { position: [-4.25, 1.15, -4.8] as [number, number, number] },
  ];
  return <>{exhibits.map((item, index) => <ProjectArtifact key={portfolio.projects[index].name} index={index} position={item.position} title={portfolio.projects[index].name} active={active} onSelect={onSelect} theme={theme} />)}</>;
}

function CameraDirector({ active, controls, reducedMotion, mobile, theme }: { active: LocationId | null; controls: RefObject<OrbitControlsImpl | null>; reducedMotion: boolean; mobile: boolean; theme: 'light' | 'dark' }) {
  const { camera, pointer } = useThree();
  const goal = useRef<{ camera: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const light = useRef<THREE.PointLight>(null);
  const lastActive = useRef<LocationId | null>(null);
  const lastMobile = useRef(mobile);

  if (active !== lastActive.current || mobile !== lastMobile.current) {
    lastActive.current = active;
    lastMobile.current = mobile;
    const location = locations.find((item) => item.id === active);
    const framedTarget = location
      ? new THREE.Vector3(location.position[0] + (mobile ? 0 : 1.2), mobile ? -1.2 : 1.25, location.position[2])
      : new THREE.Vector3(0, 0.1, -0.4);
    goal.current = location
      ? { camera: new THREE.Vector3(framedTarget.x, framedTarget.y + (mobile ? 3.2 : 3.45), location.position[2] + 7.3), target: framedTarget }
      : { camera: new THREE.Vector3(0, 8.8, 17), target: new THREE.Vector3(0, 0.1, -0.4) };
    if (reducedMotion) {
      camera.position.copy(goal.current.camera);
      controls.current?.target.copy(goal.current.target);
      controls.current?.update();
      goal.current = null;
    }
  }

  useFrame((_state, delta) => {
    const currentGoal = goal.current;
    if (currentGoal) {
      const ease = 1 - Math.exp(-delta * 1.7);
      camera.position.lerp(currentGoal.camera, ease);
      controls.current?.target.lerp(currentGoal.target, ease);
      controls.current?.update();
      if (camera.position.distanceTo(currentGoal.camera) < 0.035) goal.current = null;
    }
    if (light.current) {
      light.current.position.x = THREE.MathUtils.damp(light.current.position.x, pointer.x * 6, 2.2, delta);
      light.current.position.y = THREE.MathUtils.damp(light.current.position.y, 2.8 + pointer.y * 3.2, 2.2, delta);
    }
  });

  return <pointLight ref={light} position={[0, 3, 4]} color={scenePalette[theme].accent} intensity={theme === 'dark' ? 22 : 10} distance={16} decay={2} />;
}

function Starfield({ mobile, theme }: { mobile: boolean; theme: 'light' | 'dark' }) {
  const palette = scenePalette[theme];
  return (
    <>
      <Stars radius={42} depth={28} count={theme === 'light' ? (mobile ? 360 : 820) : mobile ? 680 : 1800} factor={2.8} saturation={0} fade speed={0.25} />
      <Sparkles count={mobile ? 45 : 115} scale={[23, 11, 23]} size={mobile ? 1.5 : 1.8} speed={0.12} opacity={theme === 'light' ? 0.24 : 0.5} color={palette.accent} />
    </>
  );
}

function WorldScene({ active, mobile, reducedMotion, onSelect, controls, theme }: Omit<WorldProps, 'onReady' | 'visible'> & { controls: RefObject<OrbitControlsImpl | null> }) {
  const palette = scenePalette[theme];
  const ambientRef = useRef<THREE.Group>(null);
  useFrame((_state, delta) => {
    if (!reducedMotion && ambientRef.current) ambientRef.current.rotation.y += delta * 0.008;
  });
  return (
    <>
      <color attach="background" args={[palette.clear]} />
      <fog attach="fog" args={[palette.fog, 12, 32]} />
      <ambientLight intensity={theme === 'dark' ? 0.82 : 1.05} color={palette.ambient} />
      <hemisphereLight args={[palette.sky, palette.ground, theme === 'dark' ? 0.68 : 0.78]} />
      <directionalLight position={[-6, 10, 5]} intensity={theme === 'dark' ? 2.1 : 2.35} color={palette.key} />
      <pointLight position={[0, -0.2, -8]} intensity={theme === 'dark' ? 18 : 8} color={palette.fill} distance={18} />
      <CameraDirector active={active} controls={controls} reducedMotion={reducedMotion} mobile={mobile} theme={theme} />
      <group ref={ambientRef}><Identity theme={theme} /></group>
      {locations.map((location) => <Station key={location.id} location={location} active={active === location.id} onSelect={onSelect} theme={theme} />)}
      <ProjectExhibits active={active === 'projects'} onSelect={onSelect} theme={theme} />
      <Grid position={[0, -0.64, 0]} infiniteGrid fadeDistance={27} fadeStrength={2.1} cellSize={1} sectionSize={5} cellColor={palette.grid} sectionColor={palette.gridSection} />
      <Starfield mobile={mobile} theme={theme} />
      <OrbitControls ref={controls} makeDefault enablePan={false} enableZoom minDistance={7.5} maxDistance={23} maxPolarAngle={Math.PI * 0.48} minPolarAngle={0.34} zoomSpeed={0.55} rotateSpeed={0.48} enableDamping dampingFactor={0.08} />
    </>
  );
}

function WebGLFallback() {
  return <div className="webgl-fallback">WebGL is unavailable here. Use the locations menu to explore the accessible archive.</div>;
}

export default function World({ active, mobile, reducedMotion, visible, theme, onSelect, onReady }: WorldProps) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  const dpr = useMemo<[number, number]>(() => mobile ? [0.72, 1] : [1, 1.5], [mobile]);
  return (
    <Canvas
      className="universe-canvas"
      dpr={dpr}
      camera={{ position: [0, 8.8, 17], fov: 43, near: 0.1, far: 80 }}
      frameloop={reducedMotion || !visible ? 'demand' : 'always'}
      gl={{ alpha: false, antialias: !mobile, powerPreference: 'low-power', stencil: false, depth: true }}
      fallback={<WebGLFallback />}
      aria-hidden="true"
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
        onReady();
      }}
    >
      <WorldScene active={active} mobile={mobile} reducedMotion={reducedMotion} theme={theme} onSelect={onSelect} controls={controls} />
    </Canvas>
  );
}
