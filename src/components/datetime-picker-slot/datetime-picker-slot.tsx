import { Component, Prop, h, State, Event, EventEmitter, Watch, Listen } from '@stencil/core';
import { builtInTranslations } from '../../utils/translations';
import { Slot } from '../../models/slot';
import { DateGrid } from '../../models/date-grid';
import { TimeGrid } from '../../models/time-grid';
import { Translations } from '../../models/translations';
import { generateDateGrid, arrangeDays } from '../../utils/generate-date-grid';
import { generateTimeGrid } from '../../utils/generate-time-grid';

@Component({
  tag: 'datetime-picker-slot',
  styleUrl: 'datetime-picker-slot.css',
})
export class DatetimePickerSlot {
  @Prop() placeholder: string = 'Pick a slot';
  @Prop() timeSlotsText: string = 'Time Slot';
  @Prop() noSlotsText: string = 'No slots are available';
  @Prop() dateFormat: string = 'ddd, D MMM YYYY';
  @Prop() timeFormat: string = 'h:mm A';
  @Prop() slots: Slot[] = [];
  @Prop() language: string = 'en';
  @Prop() translations: Translations = builtInTranslations;
  @Prop() datesHiddenWhenTimesShown: boolean = false;
  @Prop() initialDisplayText: string;
  @Prop() firstDayOfWeek: number = 0; // 0 for Sunday, 1 for Monday

  @State() isPopped: boolean;
  @State() isMeoInputAboveFold: boolean;
  @State() isMeoInputLeftSide: boolean;
  @State() meoInputHeight: number;
  @State() isTimeSlotGridVisible: boolean;
  @State() activeDateGridPage: number;
  @State() dateGrids: DateGrid[];
  @State() selectedDate: string; //Eg: Wed, 25 Nov 2020
  @State() activeTimeGridPage: number;
  @State() timeGrids: TimeGrid[];
  @State() selectedTime: string; //Eg: 10 AM, 10:00 AM, 10 AM - 11 AM, 10:00 AM - 11:00 AM
  @State() displayText: string;

  @Event() slotUpdate: EventEmitter;

  @Listen('clearSlot', { target: 'document' }) //Clear slot event to reset the slot
  handleClearSlot(event) {
    console.log('Clear event', event);
    this.resetSlot();
  }

  @Listen('click', { target: 'window' }) //Close the picker outside
  handleOnClick(event) {
    let isInsideCalendar = event && event.target && event.target.className && typeof event.target.className === 'string' && event.target.className.includes('meo-') ? true : false;
    if (!isInsideCalendar) this.closeGrid();
  }

  meoInput!: HTMLInputElement;

  componentWillLoad() {
    this.processSlots(this.slots);
  }

  @Watch('slots')
  private processSlots(slots: Slot[]) {
    if (this.slots) {
      //Reset the state
      this.isTimeSlotGridVisible = false;
      this.selectedDate = undefined;
      this.selectedTime = undefined;
      this.displayText = this.initialDisplayText ? this.initialDisplayText : undefined;
      this.dateGrids = generateDateGrid(slots, this.firstDayOfWeek);
      if (this.dateGrids && this.dateGrids.length) this.activeDateGridPage = 0;
    }
  }

  private togglePopup() {
    if (this.slots) {
      if (this.meoInput.getBoundingClientRect().top < window.innerHeight / 2) this.isMeoInputAboveFold = true;
      else this.isMeoInputAboveFold = false;
      if (this.meoInput.getBoundingClientRect().left < window.innerWidth / 2) this.isMeoInputLeftSide = true;
      else this.isMeoInputLeftSide = false;
      this.meoInputHeight = this.meoInput.getBoundingClientRect().bottom - this.meoInput.getBoundingClientRect().top;
      this.isPopped = !this.isPopped;
      this.isTimeSlotGridVisible = false;
    }
  }

  private setSelectedDate(dateText: string) {
    if (dateText) {
      this.selectedDate = dateText;
      if (this.slots.length && this.slots[0].timeSlots) {
        //resetSlot until time is also chosen
        // if (this.displayText) this.resetSlot();
        let slot = this.slots.find(s => s.date === this.selectedDate);
        this.timeGrids = generateTimeGrid(slot, this.datesHiddenWhenTimesShown);
        this.selectedTime = undefined;
        if (this.timeGrids && this.timeGrids.length) this.activeTimeGridPage = 0;
        this.isTimeSlotGridVisible = true;
      } else this.setSlot();
    }
  }

  private setSelectedTime(timeText: string) {
    if (timeText) {
      this.selectedTime = timeText;
      this.setSlot();
    }
  }

  private setSlot() {
    let translatedSelectedDate: string, translatedSelectedTime: string;
    if (this.dateFormat === 'MM-DD-YYYY') {
      let formattedDate = new Date(this.selectedDate);
      translatedSelectedDate = `${formattedDate.getMonth() + 1}-${formattedDate.getDate()}-${formattedDate.getFullYear()}`;
    } else {
      //ddd, D MMM YYYY
      let selectedDateParts = this.selectedDate.split(' ');
      translatedSelectedDate =
        this.getTranslation(selectedDateParts[0].substring(0, selectedDateParts[0].length - 1)) +
        ', ' +
        selectedDateParts[1] +
        ' ' +
        this.getTranslation(selectedDateParts[2]) +
        ' ' +
        selectedDateParts[3];
    }
    if (this.selectedTime) {
      translatedSelectedTime = this.formatTimeSlot(this.selectedTime);
      translatedSelectedTime = translatedSelectedTime.replace(/AM/g, this.getTranslation('AM'));
      translatedSelectedTime = translatedSelectedTime.replace(/PM/g, this.getTranslation('PM'));
    }
    this.displayText = translatedSelectedDate + (this.selectedTime ? ', ' + translatedSelectedTime : '');
    this.slotUpdate.emit({
      date: this.selectedDate,
      timeSlot: this.selectedTime,
      translatedDate: translatedSelectedDate,
      translatedTimeSlot: translatedSelectedTime,
    });
    this.isPopped = false;
    this.isTimeSlotGridVisible = false;
  }

  private resetSlot() {
    this.displayText = undefined;
    this.slotUpdate.emit({
      date: null,
      timeSlot: null,
      translatedDate: null,
      translatedTimeSlot: null,
    });
  }

  private closeGrid() {
    this.isPopped = false;
    this.isTimeSlotGridVisible = false;
    if (!this.displayText) {
      this.selectedDate = undefined;
      this.selectedTime = undefined;
    }
  }

  private goBack() {
    this.isTimeSlotGridVisible = false;
  }

  private prevDateGrid() {
    if (this.activeDateGridPage > 0) this.activeDateGridPage--;
  }

  private nextDateGrid() {
    if (this.activeDateGridPage < this.dateGrids.length - 1) this.activeDateGridPage++;
  }

  private prevTimeGrid() {
    if (this.activeTimeGridPage > 0) this.activeTimeGridPage--;
  }

  private nextTimeGrid() {
    if (this.activeTimeGridPage < this.timeGrids.length - 1) this.activeTimeGridPage++;
  }

  private getTranslation(propertyName: string): string {
    if (this.translations[this.language]) return this.translations[this.language][propertyName];
    else return builtInTranslations['en'][propertyName]; //use default
  }

  private formatTimeSlot(timeText: string): string {
    //Util function - starts
    let changeToHhmm = (timeTextPart: string): string => {
      let justTimePart = timeTextPart.replace(/ AM/g, '');
      justTimePart = justTimePart.replace(/ PM/g, '');
      if (timeTextPart.indexOf('AM') > -1) {
        let hourPart = justTimePart.split(':')[0].trim();
        if (hourPart.length === 1) hourPart = '0' + hourPart;
        if (hourPart.indexOf('12') === 0) hourPart = '00';
        return hourPart + ':' + (justTimePart.split(':')[1] ? justTimePart.split(':')[1].trim() : '00');
      } else if (timeTextPart.indexOf('PM') > -1) {
        let hourPart = justTimePart.split(':')[0].trim();
        if (hourPart.indexOf('12') !== 0) hourPart = (parseInt(hourPart) + 12).toString();
        return hourPart + ':' + (justTimePart.split(':')[1] ? justTimePart.split(':')[1].trim() : '00');
      }
    };
    //Util function - ends
    let formattedTimeText = timeText;
    if (this.timeFormat === 'HH:mm') {
      if (timeText.indexOf('-') > -1) {
        let timeTextParts: string[];
        timeTextParts = timeText.split('-');
        timeTextParts = timeTextParts.map(timeTextPart => changeToHhmm(timeTextPart));
        formattedTimeText = timeTextParts[0] + ' - ' + timeTextParts[1];
      } else {
        formattedTimeText = changeToHhmm(timeText);
      }
    }
    return formattedTimeText;
  }

  render() {
    let popupStyle = {
      bottom: !this.isMeoInputAboveFold ? this.meoInputHeight + 'px' : undefined,
      left: this.isMeoInputLeftSide ? '0px' : undefined,
      right: !this.isMeoInputLeftSide ? '0px' : undefined,
    };
    let activeMonthYear: string[];
    if (this.dateGrids && this.dateGrids.length > 0) activeMonthYear = this.dateGrids[this.activeDateGridPage].monthYear.split(' ');
    return (
      <span class="meo-slot-picker">
        <input
          class="meo-input"
          type="text"
          readonly
          placeholder={this.placeholder}
          value={this.displayText}
          onClick={() => this.togglePopup()}
          ref={el => (this.meoInput = el as HTMLInputElement)}
        ></input>
        {this.isPopped && (
          <div style={popupStyle} class={this.isMeoInputAboveFold ? 'meo-popup meo-popup-below' : 'meo-popup meo-popup-above'}>
            {/* Date Grid when data exists */}
            {(!this.isTimeSlotGridVisible || !this.datesHiddenWhenTimesShown) && this.dateGrids && this.dateGrids.length > 0 && (
              <table class="meo-table meo-grid meo-date-grid">
                <tr class="meo-tr">
                  <th class="meo-th meo-left-end"></th>
                  <th colSpan={5} class="meo-th meo-center">
                    <span
                      class={this.activeDateGridPage > 0 ? 'meo-paginate' : 'meo-paginate meo-paginate-disabled'}
                      onClick={() => {
                        if (this.activeDateGridPage > 0) this.prevDateGrid();
                      }}
                    >
                      &lt;
                    </span>
                    {this.getTranslation(activeMonthYear[0]) + ' ' + activeMonthYear[1]}
                    <span
                      class={this.activeDateGridPage < this.dateGrids.length - 1 ? 'meo-paginate' : 'meo-paginate meo-paginate-disabled'}
                      onClick={() => {
                        if (this.activeDateGridPage < this.dateGrids.length - 1) this.nextDateGrid();
                      }}
                    >
                      &gt;
                    </span>
                  </th>
                  <th class="meo-th meo-right-end">
                    <span class="meo-close" onClick={() => this.closeGrid()}>
                      &times;
                    </span>
                  </th>
                </tr>
                <tr class="meo-tr meo-equal-width">
                  {arrangeDays(this.firstDayOfWeek).map(day => (
                    <td class="meo-td">{this.getTranslation(day)}</td>
                  ))}
                </tr>
                {this.dateGrids[this.activeDateGridPage].weeks.map(week => {
                  return (
                    <tr class="meo-tr meo-equal-width">
                      {week.days.map(day => {
                        return day ? (
                          <td
                            class={
                              !day.isEnabled
                                ? 'meo-td meo-cell meo-cell-disabled'
                                : day.dateText == this.selectedDate
                                ? 'meo-td meo-cell meo-cell-selected'
                                : 'meo-td meo-cell meo-cell-enabled'
                            }
                            onClick={() => this.setSelectedDate(day.isEnabled ? day.dateText : undefined)}
                          >
                            <span class={!day.isEnabled ? 'meo-day meo-day-disabled' : day.dateText == this.selectedDate ? 'meo-day meo-day-selected' : 'meo-day meo-day-enabled'}>
                              {day.dayOfMonth}
                            </span>
                          </td>
                        ) : (
                          <td class="meo-td">&nbsp;</td>
                        );
                      })}
                    </tr>
                  );
                })}
              </table>
            )}
            {(!this.isTimeSlotGridVisible || !this.datesHiddenWhenTimesShown) && this.dateGrids && !this.dateGrids.length && (
              <table class="meo-table meo-grid meo-empty-grid">
                <tr class="meo-tr">
                  <th class="meo-th meo-left-end"></th>
                  <th colSpan={5} class="meo-th meo-center">
                    &nbsp;
                  </th>
                  <th class="meo-th meo-right-end">
                    <span class="meo-close" onClick={() => this.closeGrid()}>
                      &times;
                    </span>
                  </th>
                </tr>
                <tr class="meo-tr">
                  <td colSpan={7} class="meo-td">
                    &nbsp;
                  </td>
                </tr>
                <tr class="meo-tr">
                  <td colSpan={7} class="meo-td">
                    &nbsp;
                  </td>
                </tr>
                <tr class="meo-tr">
                  <td colSpan={7} class="meo-td meo-no-slots-text">
                    {this.noSlotsText}
                  </td>
                </tr>
                <tr class="meo-tr">
                  <td colSpan={7} class="meo-td">
                    &nbsp;
                  </td>
                </tr>
                <tr class="meo-tr">
                  <td colSpan={7} class="meo-td">
                    &nbsp;
                  </td>
                </tr>
                <tr class="meo-tr">
                  <td colSpan={7} class="meo-td">
                    &nbsp;
                  </td>
                </tr>
                <tr class="meo-tr">
                  <td colSpan={7} class="meo-td">
                    &nbsp;
                  </td>
                </tr>
              </table>
            )}
            {(this.isTimeSlotGridVisible || (!this.datesHiddenWhenTimesShown && this.selectedDate)) && this.timeGrids && this.timeGrids.length > 0 && (
              <div>
                {this.datesHiddenWhenTimesShown && (
                  <table class="meo-table meo-grid meo-time-grid">
                    <tr class="meo-tr">
                      <th class="meo-th meo-left-end">
                        <span class="meo-back" onClick={() => this.goBack()}>
                          &larr;
                        </span>
                      </th>
                      <th class="meo-th meo-center" colSpan={6}>
                        {this.timeSlotsText}
                      </th>
                      <th class="meo-th meo-right-end">
                        <span class="meo-close" onClick={() => this.closeGrid()}>
                          &times;
                        </span>
                      </th>
                    </tr>
                  </table>
                )}
                <div class={this.datesHiddenWhenTimesShown && this.isTimeSlotGridVisible ? ' meo-scroll' : ''}>
                  <table class="meo-table meo-grid meo-time-grid">
                    {this.timeGrids[this.activeTimeGridPage].rows.map(row => {
                      return (
                        <tr class="meo-tr meo-equal-width">
                          {row.times.map(time => {
                            let translatedTimeText;
                            if (time) {
                              translatedTimeText = this.formatTimeSlot(time.timeText);
                              translatedTimeText = translatedTimeText.replace(/AM/g, this.getTranslation('AM'));
                              translatedTimeText = translatedTimeText.replace(/PM/g, this.getTranslation('PM'));
                            }
                            return time ? (
                              <td
                                colSpan={row.times.length === 2 ? 4 : 2}
                                class={time.timeText == this.selectedTime ? 'meo-td meo-cell meo-cell-selected' : 'meo-td meo-cell meo-cell-enabled'}
                                onClick={() => this.setSelectedTime(time.timeText)}
                              >
                                <span class={time.timeText == this.selectedTime ? 'meo-time meo-time-selected' : 'meo-time meo-time-enabled'}>{translatedTimeText}</span>
                              </td>
                            ) : (
                              <td colSpan={row.times.length === 2 ? 4 : 2} class="meo-td">
                                &nbsp;
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </table>
                </div>
                {!this.datesHiddenWhenTimesShown && this.timeGrids && this.timeGrids.length > 0 && (
                  <table class="meo-table meo-grid meo-time-grid">
                    <tr class="meo-tr">
                      <th class="meo-th meo-left-end">
                        <span>&nbsp;</span>
                      </th>
                      <th class="meo-th meo-center" colSpan={6}>
                        <span
                          class={this.activeTimeGridPage > 0 ? 'meo-paginate' : 'meo-paginate meo-paginate-disabled'}
                          onClick={() => {
                            if (this.activeTimeGridPage > 0) this.prevTimeGrid();
                          }}
                        >
                          &lt;
                        </span>
                        {this.timeSlotsText}
                        <span
                          class={this.activeTimeGridPage < this.timeGrids.length - 1 ? 'meo-paginate' : 'meo-paginate meo-paginate-disabled'}
                          onClick={() => {
                            if (this.activeTimeGridPage < this.timeGrids.length - 1) this.nextTimeGrid();
                          }}
                        >
                          &gt;
                        </span>
                      </th>
                      <th class="meo-th meo-right-end">
                        <span>&nbsp;</span>
                      </th>
                    </tr>
                  </table>
                )}
              </div>
            )}
            {(this.isTimeSlotGridVisible || (!this.datesHiddenWhenTimesShown && this.selectedDate)) && this.timeGrids && !this.timeGrids.length && (
              <table class="meo-table meo-grid meo-empty-grid">
                <tr class="meo-tr">
                  <th class="meo-th meo-left-end">
                    {this.datesHiddenWhenTimesShown ? (
                      <span class="meo-back" onClick={() => this.goBack()}>
                        &larr;
                      </span>
                    ) : (
                      <span>&nbsp;</span>
                    )}
                  </th>
                  <th colSpan={5} class="meo-th meo-center">
                    &nbsp;
                  </th>
                  <th class="meo-th meo-right-end">
                    {this.datesHiddenWhenTimesShown ? (
                      <span class="meo-close" onClick={() => this.closeGrid()}>
                        &times;
                      </span>
                    ) : (
                      <span>&nbsp;</span>
                    )}
                  </th>
                </tr>
                {this.datesHiddenWhenTimesShown && (
                  <tr class="meo-tr">
                    <td colSpan={7} class="meo-td">
                      &nbsp;
                    </td>
                  </tr>
                )}
                <tr class="meo-tr">
                  <td colSpan={7} class="meo-td">
                    &nbsp;
                  </td>
                </tr>
                <tr class="meo-tr">
                  <td colSpan={7} class="meo-td meo-no-slots-text">
                    {this.noSlotsText}
                  </td>
                </tr>
                <tr class="meo-tr">
                  <td colSpan={7} class="meo-td">
                    &nbsp;
                  </td>
                </tr>
                <tr class="meo-tr">
                  <td colSpan={7} class="meo-td">
                    &nbsp;
                  </td>
                </tr>
                {this.datesHiddenWhenTimesShown && (
                  <tr class="meo-tr">
                    <td colSpan={7} class="meo-td">
                      &nbsp;
                    </td>
                  </tr>
                )}
                {this.datesHiddenWhenTimesShown && (
                  <tr class="meo-tr">
                    <td colSpan={7} class="meo-td">
                      &nbsp;
                    </td>
                  </tr>
                )}
              </table>
            )}
          </div>
        )}
      </span>
    );
  }
}
