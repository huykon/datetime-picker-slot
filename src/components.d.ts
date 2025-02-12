/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Slot } from "./models/slot";
import { Translations } from "./models/translations";
export namespace Components {
    interface DatetimePickerSlot {
        "dateFormat": string;
        "datesHiddenWhenTimesShown": boolean;
        "firstDayOfWeek": number;
        "initialDisplayText": string;
        "language": string;
        "noSlotsText": string;
        "placeholder": string;
        "slots": Slot[];
        "timeFormat": string;
        "timeSlotsText": string;
        "translations": Translations;
    }
}
declare global {
    interface HTMLDatetimePickerSlotElement extends Components.DatetimePickerSlot, HTMLStencilElement {
    }
    var HTMLDatetimePickerSlotElement: {
        prototype: HTMLDatetimePickerSlotElement;
        new (): HTMLDatetimePickerSlotElement;
    };
    interface HTMLElementTagNameMap {
        "datetime-picker-slot": HTMLDatetimePickerSlotElement;
    }
}
declare namespace LocalJSX {
    interface DatetimePickerSlot {
        "dateFormat"?: string;
        "datesHiddenWhenTimesShown"?: boolean;
        "firstDayOfWeek"?: number;
        "initialDisplayText"?: string;
        "language"?: string;
        "noSlotsText"?: string;
        "onSlotUpdate"?: (event: CustomEvent<any>) => void;
        "placeholder"?: string;
        "slots"?: Slot[];
        "timeFormat"?: string;
        "timeSlotsText"?: string;
        "translations"?: Translations;
    }
    interface IntrinsicElements {
        "datetime-picker-slot": DatetimePickerSlot;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "datetime-picker-slot": LocalJSX.DatetimePickerSlot & JSXBase.HTMLAttributes<HTMLDatetimePickerSlotElement>;
        }
    }
}
