import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { jwtInterceptor } from './jwt.interceptor';

describe('jwtInterceptor', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNext: jasmine.SpyObj<HttpHandlerFn>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockNext = jasmine.createSpy('next').and.returnValue(of({}));

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should add Authorization header when token exists', () => {
    // Arrange
    localStorage.setItem('token', 'test-token');
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = (request) => {
      expect(request.headers.get('Authorization')).toBe('Bearer test-token');
      return of({} as any);
    };

    // Act
    jwtInterceptor(req, next);

    // Cleanup
    localStorage.removeItem('token');
  });

  it('should not add Authorization header when token does not exist', () => {
    // Arrange
    localStorage.removeItem('token');
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = (request) => {
      expect(request.headers.get('Authorization')).toBeNull();
      return of({} as any);
    };

    // Act
    jwtInterceptor(req, next);
  });

  it('should redirect to main page on 401 error', () => {
    // Arrange
    localStorage.setItem('token', 'test-token');
    const req = new HttpRequest('GET', '/api/test');
    const error = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized'
    });
    const next: HttpHandlerFn = () => throwError(() => error);

    // Act
    jwtInterceptor(req, next).subscribe({
      error: () => {
        // Expected to throw error
      }
    });

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(localStorage.getItem('lastEmail')).toBeNull();
    expect(localStorage.getItem('lastPassword')).toBeNull();

    // Cleanup
    localStorage.removeItem('token');
  });

  it('should not redirect on non-401 errors', () => {
    // Arrange
    localStorage.setItem('token', 'test-token');
    const req = new HttpRequest('GET', '/api/test');
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error'
    });
    const next: HttpHandlerFn = () => throwError(() => error);

    // Act
    jwtInterceptor(req, next).subscribe({
      error: () => {
        // Expected to throw error
      }
    });

    // Assert
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBe('test-token');

    // Cleanup
    localStorage.removeItem('token');
  });
}); 