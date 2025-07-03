/**
 * DataService.js - PHASE 3 IMPLEMENTATION
 * 
 * TODO [MVEP_PHASE_4]:
 * This module is now using Firebase Firestore for production scalability.
 * Will be enhanced with real-time sync and advanced features in Phase 4.
 * 
 * Purpose: Provides Firestore integration with CRUD operations,
 * real-time updates, and data validation for the MVEP rebuild.
 * 
 * Current Status: Firestore integration with proper security patterns
 */

import { 
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/init.js';

/**
 * Data collection schemas and validation
 */
const DATA_SCHEMAS = {
  rules: {
    required: ['name', 'description', 'conditions', 'actions', 'userId'],
    types: {
      name: 'string',
      description: 'string',
      conditions: 'object',
      actions: 'object',
      userId: 'string',
      isActive: 'boolean'
    }
  },
  transactions: {
    required: ['amount', 'description', 'category', 'date', 'userId'],
    types: {
      amount: 'number',
      description: 'string',
      category: 'string',
      date: 'string',
      userId: 'string'
    }
  },
  budgets: {
    required: ['name', 'amount', 'category', 'userId'],
    types: {
      name: 'string',
      amount: 'number',
      category: 'string',
      userId: 'string',
      isActive: 'boolean'
    }
  },
  insights: {
    required: ['title', 'description', 'type', 'userId'],
    types: {
      title: 'string',
      description: 'string',
      type: 'string',
      userId: 'string',
      data: 'object'
    }
  }
};

/**
 * Validate data against schema
 * @param {Object} data - Data to validate
 * @param {string} collection - Collection name
 * @returns {Object} Validation result
 */
const validateData = (data, collection) => {
  const schema = DATA_SCHEMAS[collection];
  if (!schema) {
    return { valid: false, errors: [`Unknown collection: ${collection}`] };
  }

  const errors = [];

  // Check required fields
  for (const field of schema.required) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check field types
  for (const [field, value] of Object.entries(data)) {
    if (schema.types[field]) {
      const expectedType = schema.types[field];
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      
      if (actualType !== expectedType) {
        errors.push(`Invalid type for ${field}: expected ${expectedType}, got ${actualType}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Initialize data service
 * @returns {Promise<boolean>} Success status
 */
export const initializeDataService = async () => {
  try {
    console.log('Firestore data service initialized successfully');
    return true;
  } catch (error) {
    console.error('Data service initialization failed:', error);
    return false;
  }
};

/**
 * Create a new document
 * @param {string} collectionName - Collection name
 * @param {Object} data - Document data
 * @returns {Promise<Object>} Created document
 */
export const createDocument = async (collectionName, data) => {
  try {
    // Validate data
    const validation = validateData(data, collectionName);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Add timestamps
    const documentData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Create document in Firestore
    const docRef = await addDoc(collection(db, collectionName), documentData);
    
    // Get the created document
    const docSnap = await getDoc(docRef);
    const createdDoc = {
      id: docRef.id,
      ...docSnap.data()
    };

    console.log(`Created document in ${collectionName}:`, docRef.id);
    return createdDoc;
  } catch (error) {
    console.error(`Failed to create document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get a document by ID
 * @param {string} collectionName - Collection name
 * @param {string} id - Document ID
 * @returns {Promise<Object|null>} Document or null
 */
export const getDocument = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to get document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get all documents from a collection
 * @param {string} collectionName - Collection name
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Documents array
 */
export const getDocuments = async (collectionName, filters = {}) => {
  try {
    let q = collection(db, collectionName);

    // Apply filters
    if (filters.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }

    if (filters.isActive !== undefined) {
      q = query(q, where('isActive', '==', filters.isActive));
    }

    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }

    // Apply ordering (newest first)
    q = query(q, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const documents = [];

    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return documents;
  } catch (error) {
    console.error(`Failed to get documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update a document
 * @param {string} collectionName - Collection name
 * @param {string} id - Document ID
 * @param {Object} updates - Update data
 * @returns {Promise<Object>} Updated document
 */
export const updateDocument = async (collectionName, id, updates) => {
  try {
    const docRef = doc(db, collectionName, id);
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`Document with ID ${id} not found`);
    }

    // Prepare update data
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    // Validate updated document
    const currentData = { id: docSnap.id, ...docSnap.data() };
    const updatedData = { ...currentData, ...updateData };
    
    const validation = validateData(updatedData, collectionName);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Update document
    await updateDoc(docRef, updateData);

    // Get updated document
    const updatedDocSnap = await getDoc(docRef);
    const updatedDocument = {
      id: updatedDocSnap.id,
      ...updatedDocSnap.data()
    };

    console.log(`Updated document in ${collectionName}:`, id);
    return updatedDocument;
  } catch (error) {
    console.error(`Failed to update document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Delete a document
 * @param {string} collectionName - Collection name
 * @param {string} id - Document ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteDocument = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`Document with ID ${id} not found`);
    }

    await deleteDoc(docRef);

    console.log(`Deleted document from ${collectionName}:`, id);
    return true;
  } catch (error) {
    console.error(`Failed to delete document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Query documents with advanced filtering
 * @param {string} collectionName - Collection name
 * @param {Object} queryParams - Query parameters
 * @returns {Promise<Array>} Filtered documents
 */
export const queryDocuments = async (collectionName, queryParams = {}) => {
  try {
    let q = collection(db, collectionName);

    // Apply where conditions
    if (queryParams.where) {
      for (const [field, condition] of Object.entries(queryParams.where)) {
        if (condition.eq !== undefined) {
          q = query(q, where(field, '==', condition.eq));
        }
        if (condition.gt !== undefined) {
          q = query(q, where(field, '>', condition.gt));
        }
        if (condition.lt !== undefined) {
          q = query(q, where(field, '<', condition.lt));
        }
        if (condition.in !== undefined) {
          q = query(q, where(field, 'in', condition.in));
        }
      }
    }

    // Apply ordering
    if (queryParams.orderBy) {
      const [field, direction] = queryParams.orderBy.split(' ');
      q = query(q, orderBy(field, direction || 'asc'));
    }

    // Apply limit
    if (queryParams.limit) {
      q = query(q, limit(queryParams.limit));
    }

    const querySnapshot = await getDocs(q);
    const documents = [];

    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return documents;
  } catch (error) {
    console.error(`Failed to query documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get user preferences
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User preferences
 */
export const getUserPreferences = async (userId) => {
  try {
    const docRef = doc(db, 'userPreferences', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    
    // Return default preferences
    return {
      id: userId,
      userId,
      theme: 'light',
      notifications: true,
      currency: 'USD',
      language: 'en',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
  } catch (error) {
    console.error('Failed to get user preferences:', error);
    throw error;
  }
};

/**
 * Update user preferences
 * @param {string} userId - User ID
 * @param {Object} preferences - New preferences
 * @returns {Promise<Object>} Updated preferences
 */
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const docRef = doc(db, 'userPreferences', userId);
    const docSnap = await getDoc(docRef);

    const updatedPrefs = {
      userId,
      ...preferences,
      updatedAt: serverTimestamp()
    };

    if (docSnap.exists()) {
      // Update existing preferences
      await updateDoc(docRef, updatedPrefs);
    } else {
      // Create new preferences
      updatedPrefs.createdAt = serverTimestamp();
      await setDoc(docRef, updatedPrefs);
    }

    return {
      id: userId,
      ...updatedPrefs
    };
  } catch (error) {
    console.error('Failed to update user preferences:', error);
    throw error;
  }
};

/**
 * Export data for backup
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Exported data
 */
export const exportUserData = async (userId) => {
  try {
    const collections = ['rules', 'transactions', 'budgets', 'insights'];
    const exportedData = {};

    for (const collectionName of collections) {
      const data = await getDocuments(collectionName, { userId });
      exportedData[collectionName] = data;
    }

    const preferences = await getUserPreferences(userId);
    exportedData.preferences = preferences;

    return exportedData;
  } catch (error) {
    console.error('Failed to export user data:', error);
    throw error;
  }
};

/**
 * Import data from backup
 * @param {string} userId - User ID
 * @param {Object} data - Data to import
 * @returns {Promise<boolean>} Success status
 */
export const importUserData = async (userId, data) => {
  try {
    const collections = ['rules', 'transactions', 'budgets', 'insights'];

    for (const collectionName of collections) {
      if (data[collectionName] && Array.isArray(data[collectionName])) {
        for (const item of data[collectionName]) {
          // Update userId to current user
          const itemWithUserId = { ...item, userId };
          
          try {
            await createDocument(collectionName, itemWithUserId);
          } catch (error) {
            // Skip duplicates
            if (!error.message.includes('already exists')) {
              throw error;
            }
          }
        }
      }
    }

    if (data.preferences) {
      await updateUserPreferences(userId, data.preferences);
    }

    return true;
  } catch (error) {
    console.error('Failed to import user data:', error);
    throw error;
  }
};

/**
 * Set up real-time listener for a collection
 * @param {string} collectionName - Collection name
 * @param {Object} filters - Optional filters
 * @param {Function} callback - Callback function for updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToCollection = (collectionName, filters = {}, callback) => {
  try {
    let q = collection(db, collectionName);

    // Apply filters
    if (filters.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }

    if (filters.isActive !== undefined) {
      q = query(q, where('isActive', '==', filters.isActive));
    }

    // Apply ordering
    q = query(q, orderBy('createdAt', 'desc'));

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(documents);
    });

    return unsubscribe;
  } catch (error) {
    console.error(`Failed to subscribe to ${collectionName}:`, error);
    throw error;
  }
};

export const getDemoTransactions = () => ([
  { id: 'demo1', description: 'Spotify', amount: 9.99, date: '2025-06-02' },
  { id: 'demo2', description: 'Gas', amount: 44.90, date: '2025-06-05' },
]);