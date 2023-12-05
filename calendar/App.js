import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Modal, FlatList } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  monthNamesShort: [
    'Th.1',
    'Th.2',
    'Th.3',
    'Th.4',
    'Th.5',
    'Th.6',
    'Th.7',
    'Th.8',
    'Th.9',
    'Th.10',
    'Th.11',
    'Th.12',
  ],
  dayNames: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
};

LocaleConfig.defaultLocale = 'vi';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      note: '',
      dailyNotes: {},
      isModalVisible: false,
      isAllEventsModalVisible: false,
      editNoteIndex: null,
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.onNoteChange = this.onNoteChange.bind(this);
    this.saveNote = this.saveNote.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editNote = this.editNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.onMonthChange = this.onMonthChange.bind(this);
    this.openAllEventsModal = this.openAllEventsModal.bind(this);
    this.closeAllEventsModal = this.closeAllEventsModal.bind(this);
  }

  onMonthChange(month) {
    console.log('Selected month:', month.month, 'Selected year:', month.year);
    this.setState({});
  }

  onDateChange(day) {
    const { dailyNotes } = this.state;
    this.setState({
      selectedStartDate: day.dateString,
      note: '',
    });
  }

  onNoteChange(text) {
    this.setState({
      note: text,
    });
  }

  saveNote() {
    const { selectedStartDate, note, dailyNotes, editNoteIndex } = this.state;

    if (selectedStartDate) {
      const updatedDailyNotes = { ...dailyNotes };
      const existingNotes = updatedDailyNotes[selectedStartDate] || [];

      if (editNoteIndex !== null) {
        existingNotes[editNoteIndex] = note;
      } else {
        existingNotes.push(note);
      }

      updatedDailyNotes[selectedStartDate] = existingNotes;

      this.setState({
        dailyNotes: updatedDailyNotes,
        isModalVisible: false,
        editNoteIndex: null,
        note: '',
      });
    }
  }

  openModal() {
    this.setState({
      isModalVisible: true,
    });
  }

  closeModal() {
    this.setState({
      isModalVisible: false,
      editNoteIndex: null,
      note: '',
    });
  }

  editNote(index) {
    const { selectedStartDate, dailyNotes } = this.state;
    const existingNotes = dailyNotes[selectedStartDate] || [];
    const selectedNote = existingNotes[index] || '';

    this.setState({
      note: selectedNote,
      isModalVisible: true,
      editNoteIndex: index,
    });
  }

  deleteNote(index) {
    const { selectedStartDate, dailyNotes } = this.state;
    const updatedDailyNotes = { ...dailyNotes };
    const existingNotes = updatedDailyNotes[selectedStartDate] || [];

    if (index !== null) {
      existingNotes.splice(index, 1);
      updatedDailyNotes[selectedStartDate] = existingNotes;
      if (existingNotes.length === 0) {
        delete updatedDailyNotes[selectedStartDate];
      }
    }

    this.setState({
      dailyNotes: updatedDailyNotes,
      isModalVisible: false,
      editNoteIndex: null,
      note: '',
    });
  }

  openAllEventsModal() {
    this.setState({
      isAllEventsModalVisible: true,
    });
  }

  closeAllEventsModal() {
    this.setState({
      isAllEventsModalVisible: false,
    });
  }

  getMarkedDates() {
    const { dailyNotes, selectedStartDate } = this.state;
    const markedDates = {};

    if (selectedStartDate) {
      markedDates[selectedStartDate] = { selected: true, selectedColor: 'green' };
    }

    for (const date in dailyNotes) {
      if (date !== selectedStartDate) {
        markedDates[date] = { selected: true, marked: true, dotColor: 'red' };
      }
    }

    return markedDates;
  }

  render() {
    const { selectedStartDate, note, isModalVisible, isAllEventsModalVisible, dailyNotes } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    const existingNotes = dailyNotes[selectedStartDate] || [];

    return (
      <View style={styles.container}>
       <View style={styles.buttons}>
       <Button  title="Xem tất cả sự kiện" onPress={this.openAllEventsModal} />
       </View>
        <Calendar
          onDayPress={this.onDateChange}
          onMonthChange={this.onMonthChange}
          markedDates={this.getMarkedDates()}
          theme={{
            selectedDayBackgroundColor: 'lightblue',
            todayTextColor: 'blue',
          }}
        />
        <Button title="Thêm sự kiện" onPress={this.openModal} />
        {existingNotes.length > 0 && (
          <FlatList
            data={existingNotes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.noteContainer}>
                <Text style={styles.noteText}>{item}</Text>
                <View style={styles.buttonContainer}>
                  <Button title="Chỉnh sửa" onPress={() => this.editNote(index)} />
                  <Button title="Xóa" onPress={() => this.deleteNote(index)} />
                </View>
              </View>
            )}
          />
        )}

        <Modal
          animationType="slide"
          transparent={false}
          visible={isModalVisible}
          onRequestClose={this.closeModal}
        >
          <View style={styles.modalContainer}>
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={styles.noteInput}
              placeholder="Nhập sự kiện..."
              onChangeText={this.onNoteChange}
              value={note}
            />
            <View style={styles.buttonWrapper}>
              <Button title="Lưu" onPress={this.saveNote} />
              <Button title="Đóng" onPress={this.closeModal} />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={isAllEventsModalVisible}
          onRequestClose={this.closeAllEventsModal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Tất cả sự kiện</Text>
            {Object.entries(dailyNotes).map(([date, events]) => (
              <View key={date}>
                <Text style={styles.dateTitle}>{date}</Text>
                {events.map((event, index) => (
                  <Text key={index} style={styles.eventText}>
                    {event}
                  </Text>
                ))}
              </View>
            ))}
            <Button title="Đóng" onPress={this.closeAllEventsModal} />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 100,
    padding: 15,
  },
  buttons: {
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    left: 80,
    marginTop: 10,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    alignItems: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteInput: {
    height: 150,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 20,
    paddingLeft: 8,
  },
  noteContainer: {
    marginTop: 10,
    padding: 8,
    borderColor: 'gray',
    borderWidth: 1,
  },
  noteText: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  eventText: {
    marginBottom: 5,
  },
});
