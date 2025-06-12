
import React, { useMemo } from 'react';
import * as THREE from 'three';

interface BaseballCardBorderProps {
  borderStyle: 'classic' | 'vintage' | 'modern';
  teamColors: {
    primary: string;
    secondary: string;
  };
  cardSize: {
    width: number;
    height: number;
    depth: number;
  };
}

const BaseballCardBorder: React.FC<BaseballCardBorderProps> = ({
  borderStyle,
  teamColors,
  cardSize
}) => {
  const { width, height, depth } = cardSize;
  
  // Border dimensions based on style
  const borderSpecs = useMemo(() => {
    switch (borderStyle) {
      case 'classic':
        return {
          outerBorderWidth: 0.08,
          innerBorderWidth: 0.04,
          cornerRadius: 0.02,
          outerColor: '#f8f8f8',
          innerColor: teamColors.secondary
        };
      case 'vintage':
        return {
          outerBorderWidth: 0.12,
          innerBorderWidth: 0.06,
          cornerRadius: 0.01,
          outerColor: '#fff8dc',
          innerColor: teamColors.primary
        };
      case 'modern':
        return {
          outerBorderWidth: 0.06,
          innerBorderWidth: 0.02,
          cornerRadius: 0.04,
          outerColor: '#ffffff',
          innerColor: teamColors.secondary
        };
      default:
        return {
          outerBorderWidth: 0.08,
          innerBorderWidth: 0.04,
          cornerRadius: 0.02,
          outerColor: '#f8f8f8',
          innerColor: teamColors.secondary
        };
    }
  }, [borderStyle, teamColors]);

  // Materials for different border layers
  const outerBorderMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: borderSpecs.outerColor,
      metalness: 0.1,
      roughness: 0.8,
      envMapIntensity: 0.3,
    });
  }, [borderSpecs.outerColor]);

  const innerBorderMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: borderSpecs.innerColor,
      metalness: 0.3,
      roughness: 0.4,
      envMapIntensity: 0.6,
    });
  }, [borderSpecs.innerColor]);

  return (
    <group>
      {/* Outer Border Frame */}
      <mesh position={[0, 0, depth * 0.5 + 0.002]}>
        <boxGeometry args={[
          width + borderSpecs.outerBorderWidth * 2,
          height + borderSpecs.outerBorderWidth * 2,
          0.01
        ]} />
        <primitive object={outerBorderMaterial} />
      </mesh>

      {/* Inner Border Trim */}
      <mesh position={[0, 0, depth * 0.5 + 0.003]}>
        <boxGeometry args={[
          width + borderSpecs.innerBorderWidth * 2,
          height + borderSpecs.innerBorderWidth * 2,
          0.005
        ]} />
        <primitive object={innerBorderMaterial} />
      </mesh>

      {/* Corner Accents (for classic and vintage styles) */}
      {(borderStyle === 'classic' || borderStyle === 'vintage') && (
        <>
          {/* Top-left corner */}
          <mesh position={[
            -(width / 2 + borderSpecs.outerBorderWidth * 0.7),
            height / 2 + borderSpecs.outerBorderWidth * 0.7,
            depth * 0.5 + 0.004
          ]}>
            <cylinderGeometry args={[0.02, 0.02, 0.002]} />
            <primitive object={innerBorderMaterial} />
          </mesh>

          {/* Top-right corner */}
          <mesh position={[
            width / 2 + borderSpecs.outerBorderWidth * 0.7,
            height / 2 + borderSpecs.outerBorderWidth * 0.7,
            depth * 0.5 + 0.004
          ]}>
            <cylinderGeometry args={[0.02, 0.02, 0.002]} />
            <primitive object={innerBorderMaterial} />
          </mesh>

          {/* Bottom-left corner */}
          <mesh position={[
            -(width / 2 + borderSpecs.outerBorderWidth * 0.7),
            -(height / 2 + borderSpecs.outerBorderWidth * 0.7),
            depth * 0.5 + 0.004
          ]}>
            <cylinderGeometry args={[0.02, 0.02, 0.002]} />
            <primitive object={innerBorderMaterial} />
          </mesh>

          {/* Bottom-right corner */}
          <mesh position={[
            width / 2 + borderSpecs.outerBorderWidth * 0.7,
            -(height / 2 + borderSpecs.outerBorderWidth * 0.7),
            depth * 0.5 + 0.004
          ]}>
            <cylinderGeometry args={[0.02, 0.02, 0.002]} />
            <primitive object={innerBorderMaterial} />
          </mesh>
        </>
      )}

      {/* Subtle shadow plane behind the card */}
      <mesh position={[0, 0, -depth * 0.5 - 0.01]} rotation={[0, 0, 0]}>
        <planeGeometry args={[
          width + borderSpecs.outerBorderWidth * 3,
          height + borderSpecs.outerBorderWidth * 3
        ]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
};

export default BaseballCardBorder;
