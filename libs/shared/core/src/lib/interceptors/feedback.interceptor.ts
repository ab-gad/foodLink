import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, finalize, timer } from 'rxjs';
import { GlobalLoaderService } from '../services/global-loader.service';
import { SHOW_GLOBAL_LOADER, TOAST_PROMISE_CONFIG } from '@foodlink/shared-util';
import { toast } from '@spartan-ng/brain/sonner';

export const feedbackInterceptor: HttpInterceptorFn = (req, next) => {
    const loaderService = inject(GlobalLoaderService);

    const useGlobalLoader = req.context.get(SHOW_GLOBAL_LOADER);
    const toastConfig = req.context.get(TOAST_PROMISE_CONFIG);
    const MIN_DELAY = 500;

    let toastId: string | number | null = null;

    if (useGlobalLoader) {
        loaderService.show();
    }

    if (toastConfig?.loading) {
        toastId = toast.loading(toastConfig.loading, { dismissible: false, duration: 10000, position: 'bottom-center' });
    }
    return next(req).pipe(
        tap({
            next: (event) => {
                if (event.type != HttpEventType.Response) return;
                if (toastConfig?.success) {
                    timer(MIN_DELAY).subscribe(() => {
                        toast.success(toastConfig.success, { id: toastId ?? undefined, position: 'bottom-center' });
                    });
                }
            },
            error: (err: HttpErrorResponse) => {
                if (toastConfig?.hideError) return;
                const customError = toastConfig?.error || (err.error?.message || err.message) as string;
                const errorMsg = typeof customError === 'function' ? customError(err) : customError;
                timer(MIN_DELAY).subscribe(() => {
                    toast.error(errorMsg, { id: toastId ?? undefined, position: 'bottom-center' });
                });
            }
        }),
        finalize(() => {
            if (useGlobalLoader) {
                toastId = null;
                timer(MIN_DELAY).subscribe(() => loaderService.hide());
            }
        })
    );
};