/* ref: https://gist.github.com/jed/982883 */

function r(): number {
    const c: RandomSource = window.crypto;
    const arr = new Uint8Array(1);
    return c ? Math.random() * 16 | 0 : c.getRandomValues(arr) && arr[0] >> 4;
}

function b(
    a?: string					// placeholder
): string {
    return a				  // if the placeholder was passed, return
        ? (					  // a random number from 0 to 15
            +a ^			  // unless b is 8,
            r()				  // a random number from
            >> +a / 4		  // 8 to 11
        ).toString(16)		  // in hexadecimal
        : '00000000-0000-4000-8000-000000000000'.replace(     // replacing
            /[018]/g,			// zeroes, ones, and eights with
            b					// random hex digits
        )
}
/**
 *
 * @returns {string}
 */
export default function (): string {
    return b();
}
