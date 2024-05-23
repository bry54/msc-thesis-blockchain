export enum StakeholderTypes {
  FARM = 'FARM ORGANIZATION',
  WHOLESALER = 'WHOLESALER ORGANIZATION',
  RETAILER = 'RETAILER ORGANIZATION',
  REGULATORY_AUTHORITY = 'REGULATORY AUTHORITY ORGANIZATION',
  LOGISTICS_PROVIDER = 'TRANSPORTER/LOGISTICS PROVIDER ORGANIZATION',
}

export enum Roles {
  FARMER = 'FARMER',
  REGULATION_CHECHER = 'REGULATION CHECKER',
  MANAGER = 'MANAGER',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

const roles = {
  farmer: {
    can: [
      'create:production',
      'update:production',
      'view:regulatory',
      'view:transportation',
    ],
  },
  regulatoryAuthority: {
    can: [
      'create:regulatory',
      'update:regulatory',
      'view:production',
      'view:transportation',
    ],
  },
  wholesaler: {
    can: ['view:production', 'view:regulatory', 'update:transportation'],
  },
  retailer: {
    can: ['view:production', 'view:regulatory', 'update:productState'],
  },
  transporter: {
    can: [
      'create:transportation',
      'update:transportation',
      'view:production',
      'view:regulatory',
    ],
  },
  consumer: {
    can: ['view:productHistory'],
  },
  systemAdministrator: {
    can: ['manage:all'],
  },
  auditor: {
    can: ['view:all', 'generate:report'],
  },
};

// Example function to check permissions
function checkPermission(role, action) {
  return roles[role]?.can.includes(action);
}

const exampleMiddlware = () => {
  // Usage
  if (checkPermission('farmer', 'create:production')) {
    // Allow action
  } else {
    // Deny action
  }
};
