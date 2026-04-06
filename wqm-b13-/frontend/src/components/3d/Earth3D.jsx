import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';

export const Earth3D = () => {
    const earthRef = useRef();
    const cloudsRef = useRef();

    // Load textures from reliable NASA/Three.js sources
    const [colorMap, specularMap, cloudsMap] = useLoader(TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    ]);

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();
        if (earthRef.current) {
            earthRef.current.rotation.y = elapsedTime * 0.05;
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y = elapsedTime * 0.06;
        }
    });

    return (
        <>
            {/* Lighting for Space Ambience */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 5, 10]} intensity={2} color="#ffffff" />
            <pointLight position={[-10, -5, -10]} intensity={1} color="#0A2540" />

            {/* Stars Background */}
            <Stars radius={300} depth={50} count={6000} factor={4} saturation={0.5} fade speed={1.5} />

            {/* Earth Sphere */}
            <Sphere ref={earthRef} args={[1, 128, 128]} scale={2.5}>
                <meshPhongMaterial
                    map={colorMap}
                    specularMap={specularMap}
                    displacementMap={specularMap}
                    displacementScale={0.02}
                    shininess={25}
                    specular={new THREE.Color('#90E0EF')}
                />
            </Sphere>

            {/* Atmosphere Glow (Inner) */}
            <mesh scale={[2.55, 2.55, 2.55]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshPhongMaterial
                    color="#00B4D8"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Atmosphere Glow (Outer) - Protecting Earth */}
            <mesh scale={[2.7, 2.7, 2.7]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshLambertMaterial
                    color="#90E0EF"
                    transparent
                    opacity={0.08}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Cloud Layer */}
            <mesh ref={cloudsRef} scale={[2.52, 2.52, 2.52]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    map={cloudsMap}
                    transparent={true}
                    opacity={0.4}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </>
    );
};
