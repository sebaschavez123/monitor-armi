import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: '[input-mail]'
})
export class InputMailDirective {

    // definir teclas adicionales
    navigationKeys= ['Backspace', 'Delete', 'Tab', 'Escape', 'ArrowLeft', 'ArrowRight', 'End', 'Home'];
    alphabet = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890.-_@';

    constructor(private el: ElementRef) {}

    @HostListener('keydown', ['$event'])
    onKeyDown(e: KeyboardEvent) {
        if (
            // Permitir teclas especiales: Delete, Backspace, etc.
            this.navigationKeys.indexOf(e.key) > -1 || 
            (e.key === 'a' && e.ctrlKey === true) || // Permite: Ctrl+A
            (e.key === 'c' && e.ctrlKey === true) || // Permite: Ctrl+C
            (e.key === 'v' && e.ctrlKey === true) || // Permite: Ctrl+V
            (e.key === 'x' && e.ctrlKey === true) || // Permite: Ctrl+X
            (e.key === 'a' && e.metaKey === true) || // Cmd+A (para Mac)
            (e.key === 'c' && e.metaKey === true) || // Cmd+C (para Mac)
            (e.key === 'v' && e.metaKey === true) || // Cmd+V (para Mac)
            (e.key === 'x' && e.metaKey === true)    // Cmd+X (para Mac)
        ) {
            return;  // déjalo pasar, no hacer nada.
        }
        // Si no es número, detenga la pulsación de la tecla.
        if (this.alphabet.indexOf(e.key) < 0 ) {
            e.preventDefault();
        }
    }
    
    /*
    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        event.preventDefault();
        const pastedInput: string = event.clipboardData
            .getData('text/plain')
            .replace(/\D/g, ''); // toma solo los números.
        this.el.nativeElement.value = pastedInput;
        
    }
    
    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        event.preventDefault();
        const textData = event.dataTransfer
            .getData('text').replace(/\D/g, '');
        this.el.nativeElement.focus();
        this.el.nativeElement.value = textData;     
    }
    */
}