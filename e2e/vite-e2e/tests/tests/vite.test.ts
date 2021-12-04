import {
  checkFilesExist,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { ensureNxProjectWithDeps } from '../utils/testing';

describe('vite e2e', () => {
  beforeAll(() => {
    ensureNxProjectWithDeps('@nxext/vite', 'dist/packages/vite', []);
  });

  describe('vite app', () => {
    it('should build vite application', async () => {
      const plugin = uniq('vite');
      await runNxCommandAsync(`generate @nxext/vite:app ${plugin}`);

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain('Bundle complete');

      expect(() =>
        checkFilesExist(`dist/apps/${plugin}/index.html`)
      ).not.toThrow();
    });

    it('should add tags to project', async () => {
      const plugin = uniq('vitetags');
      await runNxCommandAsync(
        `generate @nxext/vite:app ${plugin} --tags e2etag,e2ePackage`
      );
      const project = readJson(`apps/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    });

    it('should generate app into directory', async () => {
      await runNxCommandAsync(`generate @nxext/vite:app project/ui`);
      expect(() =>
        checkFilesExist(`apps/project/ui/src/main.ts`)
      ).not.toThrow();
    });

    it('should be able to run linter', async () => {
      const plugin = uniq('vitelint');
      await runNxCommandAsync(`generate @nxext/vite:app ${plugin}`);

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });
  });

  describe('vite lib', () => {
    it('should create vite library', async () => {
      const plugin = uniq('vitelib');
      await runNxCommandAsync(`generate @nxext/vite:lib ${plugin}`);

      expect(() =>
        checkFilesExist(`libs/${plugin}/src/index.ts`)
      ).not.toThrow();
    });

    it('should generate lib into directory', async () => {
      await runNxCommandAsync(`generate @nxext/vite:lib project/uilib`);
      expect(() =>
        checkFilesExist(`libs/project/uilib/src/index.ts`)
      ).not.toThrow();
    });

    it('should be able to run linter', async () => {
      const plugin = uniq('viteliblint');
      await runNxCommandAsync(`generate @nxext/vite:lib ${plugin}`);

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });

    it('should be able build lib if buildable', async () => {
      const plugin = uniq('vitelib');
      await runNxCommandAsync(`generate @nxext/vite:lib ${plugin} --buildable`);

      const result = await runNxCommandAsync(`build ${plugin}`);

      expect(() =>
        checkFilesExist(
          `dist/libs/${plugin}/${plugin}.es.js`,
          `dist/libs/${plugin}/${plugin}.umd.js`
        )
      ).not.toThrow();
    });
  });
});