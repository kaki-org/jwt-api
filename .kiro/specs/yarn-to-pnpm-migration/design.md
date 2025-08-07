# Design Document

## Overview

This design outlines the migration strategy from yarn to pnpm for the frontend project located in `./front/`. The migration will involve updating package management configurations, Docker setups, CI/CD workflows, and documentation while ensuring zero downtime and maintaining all existing functionality.

The migration leverages pnpm's superior performance characteristics including faster installations, better disk space efficiency through content-addressable storage, and stricter dependency resolution that prevents phantom dependencies.

## Architecture

### Current State
- **Package Manager**: yarn v1.22.22
- **Lock File**: yarn.lock
- **Node Version**: >=20.12.2
- **Framework**: Nuxt.js 3.x with Vuetify
- **Container**: Docker with Alpine Linux base
- **CI/CD**: GitHub Actions (Ruby-focused, no frontend CI currently)

### Target State
- **Package Manager**: pnpm (latest stable)
- **Lock File**: pnpm-lock.yaml
- **Node Version**: >=20.12.2 (unchanged)
- **Framework**: Nuxt.js 3.x with Vuetify (unchanged)
- **Container**: Docker with Alpine Linux base + pnpm
- **CI/CD**: Updated documentation and configurations

### Migration Strategy
The migration follows a systematic approach:
1. **Preparation Phase**: Backup current state and analyze dependencies
2. **Package Manager Installation**: Install pnpm in Docker environment
3. **Dependency Migration**: Convert yarn.lock to pnpm-lock.yaml
4. **Configuration Updates**: Update all configuration files
5. **Testing Phase**: Verify functionality across all environments
6. **Cleanup Phase**: Remove yarn artifacts

## Components and Interfaces

### Package Management Layer
```
┌─────────────────────────────────────────┐
│            pnpm Core                    │
├─────────────────────────────────────────┤
│  • Dependency Resolution               │
│  • Content-Addressable Storage         │
│  • Symlink Management                  │
│  • Lock File Management                │
└─────────────────────────────────────────┘
```

**Interface**: Command-line interface compatible with npm/yarn
**Responsibilities**: 
- Install and manage Node.js dependencies
- Create and maintain pnpm-lock.yaml
- Provide fast, space-efficient package installation

### Docker Integration Layer
```
┌─────────────────────────────────────────┐
│         Docker Container               │
├─────────────────────────────────────────┤
│  • Alpine Linux Base                   │
│  • Node.js Runtime                     │
│  • pnpm Installation                   │
│  • Application Code                    │
└─────────────────────────────────────────┘
```

**Interface**: Dockerfile and docker-compose.yml configurations
**Responsibilities**:
- Provide containerized development environment
- Install pnpm during image build
- Execute pnpm commands for dependency management

### Build and Development Scripts
```
┌─────────────────────────────────────────┐
│         NPM Scripts Layer              │
├─────────────────────────────────────────┤
│  • dev: Development server             │
│  • build: Production build             │
│  • lint: Code quality checks           │
│  • start: Production server            │
└─────────────────────────────────────────┘
```

**Interface**: package.json scripts section
**Responsibilities**:
- Provide consistent command interface
- Execute Nuxt.js operations
- Run development and build processes

## Data Models

### Package Configuration Model
```typescript
interface PackageConfig {
  name: string;
  version: string;
  private: boolean;
  engines: {
    node: string;
  };
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}
```

### Lock File Model
```typescript
interface PnpmLockFile {
  lockfileVersion: string;
  settings: {
    autoInstallPeers: boolean;
    excludeLinksFromLockfile: boolean;
  };
  dependencies: Record<string, DependencyInfo>;
  devDependencies: Record<string, DependencyInfo>;
  packages: Record<string, PackageInfo>;
}
```

### Docker Configuration Model
```typescript
interface DockerConfig {
  baseImage: string;
  workdir: string;
  packageManager: 'pnpm';
  installCommand: string;
  buildCommand: string;
  startCommand: string;
}
```

## Error Handling

### Migration Errors
- **Dependency Resolution Conflicts**: Use pnpm's `--force` flag or manual resolution
- **Lock File Corruption**: Regenerate from package.json with clean install
- **Docker Build Failures**: Implement multi-stage builds with proper caching
- **Script Execution Errors**: Update script syntax for pnpm compatibility

### Runtime Errors
- **Missing Dependencies**: Verify pnpm-lock.yaml includes all required packages
- **Version Mismatches**: Use exact versions from current yarn.lock
- **Container Startup Issues**: Ensure pnpm is properly installed in Docker image

### Rollback Strategy
- Maintain backup of yarn.lock and package.json
- Keep Docker images with yarn setup available
- Document rollback procedures for each component
- Implement feature flags for gradual migration if needed

## Testing Strategy

### Unit Testing
- **Package Installation**: Verify all dependencies install correctly
- **Script Execution**: Test all npm scripts work with pnpm
- **Build Process**: Ensure build output matches yarn version
- **Development Server**: Confirm dev server starts and functions properly

### Integration Testing
- **Docker Environment**: Test complete containerized workflow
- **Development Workflow**: Verify developer experience remains smooth
- **Production Build**: Ensure production builds are identical
- **Dependency Resolution**: Confirm no phantom dependencies exist

### Performance Testing
- **Installation Speed**: Measure pnpm vs yarn installation times
- **Build Performance**: Compare build times between package managers
- **Disk Usage**: Verify space savings from pnpm's content-addressable storage
- **Memory Usage**: Monitor container memory consumption

### Compatibility Testing
- **Node.js Versions**: Test with specified Node.js version (>=20.12.2)
- **Operating Systems**: Verify functionality on macOS, Linux, Windows
- **Docker Platforms**: Test on different Docker host systems
- **CI/CD Integration**: Ensure documentation updates are accurate

## Implementation Phases

### Phase 1: Preparation and Analysis
- Backup current yarn.lock and package.json
- Analyze current dependency tree
- Document current build and development processes
- Set up testing environment

### Phase 2: Docker Environment Setup
- Update Dockerfile to install pnpm
- Modify docker-compose.yml for pnpm usage
- Test containerized pnpm installation
- Verify container build process

### Phase 3: Dependency Migration
- Install pnpm in development environment
- Generate pnpm-lock.yaml from existing dependencies
- Resolve any dependency conflicts
- Verify all packages install correctly

### Phase 4: Configuration Updates
- Update package.json scripts to use pnpm
- Modify dip.yml configuration
- Update documentation files
- Remove yarn-specific configurations

### Phase 5: Testing and Validation
- Run comprehensive test suite
- Verify development workflow
- Test production build process
- Validate Docker container functionality

### Phase 6: Cleanup and Documentation
- Remove yarn.lock and yarn artifacts
- Update steering documentation
- Create migration guide for other developers
- Archive old configurations for rollback capability