# Datetime Picker Slot

This is a Web Component for Date and Time Slot Picker. This project is a standalone Web Component built using StencilJS.

You have to pass in dates and time slots that you want to display.

When "timeSlots" is not passed, the component acts as a pure date picker.

This date and time slot picker is useful for below cases:
- If you have a set of dates that alone should be available for user input
- If you also want to display a custom time slot along with the date, eg: Thu, 14 Mar 2024, 5 PM - 6 PM.
- Useful for appointment booking, choosing a delivery time, restaurant reservation, etc.
- Supports multi language translations. You can pass your own translations and display text.
- Supports displaying time slots in multiple formats: Eg: 4 PM, 4:00 PM, 16:00, 4 PM - 5 PM, 4:00 PM - 5:00 PM, 16:00 - 17:00.

# Usage and Live Demo

[View demo](https://codesandbox.io/p/sandbox/datetime-slot-picker-gvd69w)

## Using the component in HTML

The properties are optional, you can use them to pass custom text.

```
<datetime-picker-slot 
      placeholder="Pick a time slot" 
      time-slots-text="Time"
      no-slots-text="No slots are available"
      >
</datetime-picker-slot>
```

To display time slots in HH:mm format, pass the "time-format" property. The "dates-hidden-when-times-shown" property can be used if you would like to make the popup more compact, when time slots are shown the date calendar will be hidden.

```
<datetime-picker-slot 
      placeholder="Pick a time slot" 
      time-slots-text="Time"
      no-slots-text="No slots are available" 
      time-format="HH:mm"
      dates-hidden-when-times-shown
      initial-display-text="Thu, 14 Mar 2024, 5 PM - 6 PM"
      >
</datetime-picker-slot>
```

## Initializing slots & listening to slot changes in Javascript

Add the below code inside <script></script> in your HTML. Ensure the input date and time format is as stated below.

Supported input date format: 
- ddd, D MMM YYYY (Tue, 12 Mar 2024)

Supported input time formats: (Pick a format and all time slots should be the same format)
- H A (10 AM)
- H:mm A (10:00 AM)
- H A - H A (10 AM - 11 AM)
- H:mm A - H:mm A (10:00 AM - 11:00 AM)

```javascript
    const datetimeSlotPicker = document.querySelector('datetime-picker-slot');
    datetimeSlotPicker.addEventListener('slotUpdate', function(event){ console.log('Updated Slot: ', event.detail) });
    datetimeSlotPicker.slots = [
        {
            date: 'Tue, 12 Mar 2024',
            timeSlots: [
            '10:00 AM',
            '11:00 AM',
            '4:00 PM',
            '5:00 PM'
            ]
        },
        {
            date: 'Thu, 14 Mar 2024',
            timeSlots: [
            '10:00 AM',
            '11:00 AM',
            '4:00 PM',
            '5:00 PM'
            ]
        }
    ];
```

If you are passing translations (using Javascript as shown below), you can set the language code

```
<datetime-picker-slot 
      placeholder="Pick a time slot" 
      time-slots-text="Time"
      no-slots-text="No slots are available" 
      language="en"
      >
</datetime-picker-slot>
```

To pass translations, also set the translations property as shown below. You can have multiple langage codes like "en".

```javascript
    const datetimeSlotPicker = document.querySelector('datetime-picker-slot');
    datetimeSlotPicker.addEventListener('slotUpdate', function(event){ console.log('Updated Slot: ', event.detail) });
    datetimeSlotPicker.slots = [
        {
            date: 'Tue, 12 Mar 2024',
            timeSlots: [
            '10 AM - 11 AM',
            '11 AM - 12 PM',
            '4 PM - 5 PM',
            '5 PM - 6 PM'
            ]
        },
        {
            date: 'Thu, 14 Mar 2024',
            timeSlots: [
            '10 AM - 11 AM',
            '11 AM - 12 PM',
            '4 PM - 5 PM',
            '5 PM - 6 PM'
            ]
        }
    ];
    datetimeSlotPicker.translations = {
        en: {
            Mon: 'Mon',
            Tue: 'Tue',
            Wed: 'Wed',
            Thu: 'Thu',
            Fri: 'Fri',
            Sat: 'Sat',
            Sun: 'Sun',
            AM: 'AM',
            PM: 'PM',
            Jan: 'Jan',
            Feb: 'Feb',
            Mar: 'Mar',
            Apr: 'Apr',
            May: 'May',
            Jun: 'Jun',
            Jul: 'Jul',
            Aug: 'Aug',
            Sep: 'Sep',
            Oct: 'Oct',
            Nov: 'Nov',
            Dec: 'Dec'
        }
    };
```

## Using this component

There are three strategies we recommend for using web components built with Stencil.

### Script tag

- Put a script tag similar to this `<script src='https://unpkg.com/datetime-picker-slot/dist/datetime-picker-slot/datetime-picker-slot.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### Node Modules
- Run `npm install datetime-picker-slot --save`
- Put a script tag similar to this `<script src='node_modules/datetime-picker-slot/dist/datetime-picker-slot/datetime-picker-slot.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### In a stencil-starter app
- Run `npm install datetime-picker-slot --save`
- Add an import to the npm packages `import datetime-picker-slot;`
- Then you can use the element anywhere in your template, JSX, html etc

## Customizing Appearance

You can customize the styling by using CSS. All HTML elemets have a class name (usually starting with "meo", Eg: "meo-input") that can be used.

## Developers

To run the project locally, run:

```bash
gh repo clone huykon/datetime-picker-slot
cd datetime-picker-slot
npm install
npm start
```

To build the component for production, run:

```bash
npm run build
```

The scripts will be generated under dist/datetime-picker-slot. 
The whole folder needs to be served, datetime-picker-slot.js acts as the entry point that's included in HTML.

## NPM Repository

https://www.npmjs.com/package/datetime-picker-slot

## Raising issues / getting help?

Please use the GitHub issue tracker - https://github.com/huykon/datetime-picker-slot/issues.