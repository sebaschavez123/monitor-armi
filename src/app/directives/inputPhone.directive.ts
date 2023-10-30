import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: '[input-phone]'
})
export class InputPhoneDirective {

    // definir teclas adicionales
    navigationKeys= ['Backspace', 'Delete', 'Tab', 'Escape'];

    constructor(private el: ElementRef) {}

    @HostListener('keydown', ['$event'])
    onKeyDown(e: KeyboardEvent) {
        if (
            // Permitir teclas especiales: Delete, Backspace, Tab, Escape, Enter, etc.
            this.navigationKeys.indexOf(e.key) > -1 || 
            (e.key === 'a' && e.ctrlKey === true) || // Permite: Ctrl+A
            (e.key === 'c' && e.ctrlKey === true) || // Permite: Ctrl+C
            (e.key === 'v' && e.ctrlKey === true) || // Permite: Ctrl+V
            (e.key === 'x' && e.ctrlKey === true) || // Permite: Ctrl+X
            (e.key === 'a' && e.metaKey === true) || // Cmd+A (para Mac)
            (e.key === 'c' && e.metaKey === true) || // Cmd+C (para Mac)
            (e.key === 'v' && e.metaKey === true) || // Cmd+V (para Mac)
            (e.key === 'x' && e.metaKey === true) // Cmd+X (para Mac)
        ) {
            return;  // déjalo pasar, no hacer nada.
        }
        // Si no es número, detenga la pulsación de la tecla.
        if (e.key === ' ' || isNaN(Number(e.key))) {
            e.preventDefault();
        }
    }

    @HostListener('change')
    onChange() {
        const pastedInput: string = this.el.nativeElement.value
            .replace(/\D/g, ''); // toma solo los números.
        this.el.nativeElement.value = pastedInput;
        return false;
    }
}