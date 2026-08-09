import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'about.html'),
        achievements: path.resolve(__dirname, 'achievements.html'),
        admin: path.resolve(__dirname, 'admin.html'),
        blogs: path.resolve(__dirname, 'blogs.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        projects: path.resolve(__dirname, 'projects.html'),
        sponsorJoin: path.resolve(__dirname, 'sponsor-join.html'),
        team: path.resolve(__dirname, 'team.html'),
        projectAquaBoat: path.resolve(__dirname, 'projects/aqua-boat.html'),
        projectDrone: path.resolve(__dirname, 'projects/drone.html'),
        projectFpvDrone: path.resolve(__dirname, 'projects/fpv-drone.html'),
        projectLineFollowing: path.resolve(__dirname, 'projects/line-following.html'),
        projectMazeSolver: path.resolve(__dirname, 'projects/maze-solver.html'),
        projectRoboRumble: path.resolve(__dirname, 'projects/robo-rumble.html'),
        projectRoboSoccer: path.resolve(__dirname, 'projects/robo-soccer.html'),
      },
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
