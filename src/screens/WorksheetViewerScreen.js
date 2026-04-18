import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions
} from 'react-native';
import { BackArrowIcon } from '../components/icons/ConditionIcons';

const { width } = Dimensions.get('window');

const WorksheetViewerScreen = ({ category, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = category.items;
  const currentItem = items[currentIndex];

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrint = () => {
    Alert.alert(
      "How to Target Print", 
      "Please take a screenshot of this worksheet outline! You can then print the picture seamlessly directly from your phone's photo gallery."
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={[styles.backButton, { backgroundColor: category.color + '20' }]}>
          <BackArrowIcon size={24} color={category.color} />
        </TouchableOpacity>
        
        <View style={styles.headerTextWrapper}>
          <Text style={styles.catTitle}>{category.title}</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentItem.title}
          </Text>
        </View>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.topActionsRow}>
        <TouchableOpacity 
          style={[styles.printButton, { backgroundColor: category.color, shadowColor: category.color }]} 
          onPress={handlePrint}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>🖨️ Save required image</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>Next Page ➔</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.previewContainer}>
        {/* The Worksheet Paper Preview */}
        <View style={styles.previewCard}>
          <View style={styles.worksheetContent}>
            {currentItem.renderImage && currentItem.renderImage()}
          </View>
        </View>
        
        {/* Pagination Indicator */}
        <View style={styles.paginationBox}>
          <Text style={[styles.previewLabel, { color: category.color }]}>
            Worksheet {currentIndex + 1} of {items.length}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 10,
  },
  backButton: {
    width: 48, height: 48,
    borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTextWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  catTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
  },
  topActionsRow: {
    flexDirection: 'row',
    padding: 24,
    justifyContent: 'space-between',
    zIndex: 5,
  },
  printButton: {
    flex: 1.2,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  nextBtnText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '800',
  },
  previewContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  previewCard: {
    width: '100%',
    aspectRatio: 1 / 1.3,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  worksheetContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paginationBox: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewLabel: {
    fontSize: 15,
    fontWeight: '800',
  }
});

export default WorksheetViewerScreen;
