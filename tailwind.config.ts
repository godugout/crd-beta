import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				crd: {
					'title-active': '#1A1A1A',
					'body': '#212121',
					'label': '#3A3A3A',
					'placeholder': '#6B6B6B',
					'line': '#E1E1E1',
					'input-bg': '#F5F5F5',
					'background': '#F8F8F8',
					'off-white': '#FAFAFA',
					'primary': '#0000FF',
					'secondary': '#FFC300',
					'error': '#FF0000',
					'success': '#00FF00',
					'warning': '#FF6B00',
					'gradient-primary': 'linear-gradient(90deg, #0000FF, #4040FF)',
					'gradient-secondary': 'linear-gradient(90deg, #FFC300, #FFD700)',
					'gradient-accent': 'linear-gradient(90deg, #8A2BE2, #9370DB)',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				cardshow: {
					blue: '#007AFF',
					'blue-light': '#E5F1FF',
					slate: '#8E8E93',
					'slate-light': '#AEAEB2',
					neutral: '#F2F2F7',
					dark: '#1C1C1E',
				},
				litmus: {
					green: {
						DEFAULT: '#48BB78',
						secondary: '#38A169',
						tertiary: '#2F855A',
						dark: '#1C4532',
						light: '#9AE6B4',
					},
					neutral: '#8E9196',
					teal: {
						DEFAULT: '#4FD1C5', 
						light: '#E6FFFA',
						dark: '#285E61',
					},
					orange: {
						DEFAULT: '#F97316',
						light: '#FFEDD5',
						dark: '#9A3412',
					},
					success: {
						DEFAULT: '#48BB78',
						light: '#F0FFF4',
					},
					red: {
						DEFAULT: '#F56565',
						light: '#FFF5F5',
					},
					gray: {
						100: '#F7FAFC',
						200: '#EDF2F7',
						300: '#E2E8F0',
						400: '#CBD5E0',
						500: '#A0AEC0',
						600: '#718096',
						700: '#4A5568',
						800: '#2D3748',
						900: '#1A202C',
					},
					gradients: {
						green: 'linear-gradient(90deg, #48BB78 0%, #9AE6B4 100%)',
						blue: 'linear-gradient(90deg, #63B3ED 0%, #90CDF4 100%)',
						orange: 'linear-gradient(90deg, #F97316 0%, #FBD38D 100%)',
						teal: 'linear-gradient(90deg, #4FD1C5 0%, #81E6D9 100%)',
					}
				},
			},
			fontFamily: {
				sans: [
					'Inter',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'sans-serif',
				],
				display: [
					'Montserrat',
					'Inter',
					'sans-serif',
				],
				'crd-display': [
					'SF Pro Display',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'sans-serif'
				],
				'crd-text': [
					'SF Pro Text',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'sans-serif'
				],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' },
				},
				'slide-up': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' },
				},
				'slide-down': {
					from: { transform: 'translateY(-10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' },
				},
				'scale-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' },
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' },
				},
				'card-hover': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(-8px)' },
				},
				'card-flip': {
					'0%': { transform: 'rotateY(0deg)' },
					'100%': { transform: 'rotateY(180deg)' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
				'pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'slide-down': 'slide-down 0.4s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'scale-out': 'scale-out 0.3s ease-out',
				'card-hover': 'card-hover 0.3s ease-out forwards',
				'card-flip': 'card-flip 0.6s ease-out forwards',
				'shimmer': 'shimmer 2s infinite linear',
				'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			boxShadow: {
				'card': '0 4px 20px -4px rgba(0, 0, 0, 0.1)',
				'card-hover': '0 12px 24px -8px rgba(0, 0, 0, 0.15)',
				'floating': '0 8px 30px rgba(0, 0, 0, 0.12)',
				'subtle': '0 2px 8px rgba(0, 0, 0, 0.05)',
				'glow': '0 0 15px rgba(72, 187, 120, 0.5)',
				'glow-strong': '0 0 25px rgba(72, 187, 120, 0.8)',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
