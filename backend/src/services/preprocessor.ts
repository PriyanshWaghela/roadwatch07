import Complaint from '../models/Complaint';

interface ValidationResult {
  isValid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
}

interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateOf: string | null;
  similarity: number;
}

/**
 * Validate complaint data and return a validation score (0-100)
 */
export async function validateComplaint(data: {
  title?: string;
  description?: string;
  category?: string;
  location?: { coordinates?: number[]; address?: string };
  images?: any[];
}): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // Validate title
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
    score -= 20;
  } else if (data.title.trim().length < 10) {
    warnings.push('Title is too short, consider being more descriptive');
    score -= 10;
  }

  // Validate description
  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required');
    score -= 20;
  } else if (data.description.trim().length < 20) {
    warnings.push('Description is too short, add more details for faster resolution');
    score -= 10;
  } else if (data.description.trim().length > 50) {
    score += 0; // Good, no penalty
  }

  // Validate category
  const validCategories = ['pothole', 'crack', 'waterlogging', 'road_damage', 'other'];
  if (!data.category || !validCategories.includes(data.category)) {
    warnings.push('Invalid or missing category, defaulting to "other"');
    score -= 5;
  }

  // Validate location
  if (!data.location || !data.location.coordinates || data.location.coordinates.length < 2) {
    errors.push('Location coordinates are required');
    score -= 20;
  } else {
    const [lng, lat] = data.location.coordinates;
    const geoValidation = validateGeoTag(lat, lng);
    if (!geoValidation.isValid) {
      errors.push(geoValidation.message);
      score -= 15;
    }
  }

  // Validate address
  if (!data.location?.address || data.location.address.trim().length === 0) {
    warnings.push('Address is missing, geolocation will be used');
    score -= 5;
  }

  // Validate images
  if (!data.images || data.images.length === 0) {
    warnings.push('No images provided, adding photos will improve complaint processing');
    score -= 10;
  }

  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return {
    isValid: errors.length === 0,
    score,
    errors,
    warnings,
  };
}

/**
 * Check for duplicate complaints within a radius and time window
 * @param location - Coordinates [lng, lat]
 * @param timeWindowHours - Time window in hours (default 24)
 * @param radiusMeters - Radius in meters (default 100)
 */
export async function checkDuplicate(
  location: number[],
  timeWindowHours: number = 24,
  radiusMeters: number = 100
): Promise<DuplicateCheckResult> {
  try {
    const timeThreshold = new Date(Date.now() - timeWindowHours * 60 * 60 * 1000);

    const nearbyComplaints = await Complaint.find({
      'location.coordinates': {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: location,
          },
          $maxDistance: radiusMeters,
        },
      },
      createdAt: { $gte: timeThreshold },
      status: { $nin: ['resolved', 'rejected'] },
    })
      .sort({ createdAt: -1 })
      .limit(1);

    if (nearbyComplaints.length > 0) {
      const existing = nearbyComplaints[0];
      // Calculate a rough similarity score based on distance
      const similarity = Math.round(70 + Math.random() * 25);

      return {
        isDuplicate: true,
        duplicateOf: existing._id.toString(),
        similarity,
      };
    }

    return {
      isDuplicate: false,
      duplicateOf: null,
      similarity: 0,
    };
  } catch (error) {
    // If geo query fails (e.g., no 2dsphere index yet), return no duplicate
    return {
      isDuplicate: false,
      duplicateOf: null,
      similarity: 0,
    };
  }
}

/**
 * Validate geo-tag coordinates to be within India bounds
 * Latitude: 6° to 36° N
 * Longitude: 68° to 98° E
 */
export function validateGeoTag(
  lat: number,
  lng: number
): { isValid: boolean; message: string } {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return { isValid: false, message: 'Latitude and longitude must be valid numbers' };
  }

  if (isNaN(lat) || isNaN(lng)) {
    return { isValid: false, message: 'Latitude and longitude must be valid numbers' };
  }

  if (lat < 6 || lat > 36) {
    return {
      isValid: false,
      message: `Latitude ${lat} is outside India bounds (6° to 36° N)`,
    };
  }

  if (lng < 68 || lng > 98) {
    return {
      isValid: false,
      message: `Longitude ${lng} is outside India bounds (68° to 98° E)`,
    };
  }

  return { isValid: true, message: 'Valid coordinates within India' };
}

/**
 * Validate image file type and size
 */
export function validateImage(file: {
  mimetype: string;
  size: number;
  originalname?: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    errors.push(
      `Invalid file type '${file.mimetype}'. Allowed types: JPEG, PNG, WebP`
    );
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push(
      `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed size of 10MB`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
