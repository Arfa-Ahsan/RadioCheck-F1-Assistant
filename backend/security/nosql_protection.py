"""
NoSQL Injection protection for MongoDB queries
Prevents malicious operators and injection attacks
"""
from typing import Any, Dict, Union
import re


class NoSQLInjectionProtector:
    """
    Protects against NoSQL injection attacks in MongoDB queries
    """
    
    # MongoDB operators that should never come from user input
    DANGEROUS_OPERATORS = [
        '$where',      # JavaScript execution
        '$regex',      # Regex injection
        '$ne',         # Not equal (can bypass auth)
        '$gt', '$gte', # Greater than (can leak data)
        '$lt', '$lte', # Less than (can leak data)
        '$in', '$nin', # In/Not in (can leak data)
        '$or', '$nor', # Logical operators (can bypass filters)
        '$and',        # AND operator
        '$not',        # NOT operator
        '$exists',     # Existence check (can leak schema)
        '$type',       # Type check (can leak schema)
        '$mod',        # Modulo operation
        '$text',       # Text search (can be abused)
        '$expr',       # Expression evaluation
        '$jsonSchema', # Schema validation
        '$elemMatch',  # Array element matching
    ]
    
    @staticmethod
    def sanitize_string(value: str) -> str:
        """
        Sanitize a string value to prevent NoSQL injection
        Removes MongoDB operators and dangerous characters
        """
        if not isinstance(value, str):
            return value
        
        # Remove any MongoDB operators
        for op in NoSQLInjectionProtector.DANGEROUS_OPERATORS:
            value = value.replace(op, '')
        
        # Remove common injection patterns
        value = value.replace('$', '')  # Remove all $ signs
        value = value.replace('{', '')  # Remove object syntax
        value = value.replace('}', '')
        value = value.replace('[', '')  # Remove array syntax
        value = value.replace(']', '')
        
        return value
    
    @staticmethod
    def validate_dict(data: Dict[str, Any]) -> bool:
        """
        Check if a dictionary contains dangerous MongoDB operators
        Returns True if safe, False if dangerous
        """
        if not isinstance(data, dict):
            return True
        
        for key, value in data.items():
            # Check for dangerous operators in keys
            if isinstance(key, str):
                for op in NoSQLInjectionProtector.DANGEROUS_OPERATORS:
                    if op in key:
                        return False
                # Check for $ in keys (MongoDB operators)
                if '$' in key:
                    return False
            
            # Recursively check nested dictionaries
            if isinstance(value, dict):
                if not NoSQLInjectionProtector.validate_dict(value):
                    return False
            
            # Check lists
            elif isinstance(value, list):
                for item in value:
                    if isinstance(item, dict):
                        if not NoSQLInjectionProtector.validate_dict(item):
                            return False
        
        return True
    
    @staticmethod
    def sanitize_query_param(value: Any) -> Any:
        """
        Sanitize a query parameter to prevent NoSQL injection
        
        Args:
            value: The parameter value (string, dict, or other)
        
        Returns:
            Sanitized value
        """
        # If it's a string, sanitize it
        if isinstance(value, str):
            return NoSQLInjectionProtector.sanitize_string(value)
        
        # If it's a dict, reject if contains operators
        elif isinstance(value, dict):
            if not NoSQLInjectionProtector.validate_dict(value):
                # Return empty string instead of dangerous dict
                return ""
            return value
        
        # If it's a list, sanitize each item
        elif isinstance(value, list):
            return [NoSQLInjectionProtector.sanitize_query_param(item) for item in value]
        
        # For other types (int, bool, etc.), return as-is
        return value
    
    @staticmethod
    def is_safe_session_id(session_id: str) -> bool:
        """
        Validate that a session ID is safe (UUID format)
        
        Args:
            session_id: The session ID to validate
        
        Returns:
            True if safe, False otherwise
        """
        if not isinstance(session_id, str):
            return False
        
        # Session IDs should be UUIDs (alphanumeric + hyphens only)
        uuid_pattern = r'^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$'
        return bool(re.match(uuid_pattern, session_id, re.IGNORECASE))
    
    @staticmethod
    def is_safe_user_id(user_id: str) -> bool:
        """
        Validate that a user ID is safe (UUID format or alphanumeric)
        
        Args:
            user_id: The user ID to validate
        
        Returns:
            True if safe, False otherwise
        """
        if not isinstance(user_id, str):
            return False
        
        # User IDs should be UUID or alphanumeric only
        # Allow UUID format or simple alphanumeric
        if re.match(r'^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$', user_id, re.IGNORECASE):
            return True
        
        # Allow simple alphanumeric (no special chars)
        return bool(re.match(r'^[a-zA-Z0-9_-]+$', user_id))
    
    @staticmethod
    def sanitize_mongodb_filter(filter_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sanitize a MongoDB filter dictionary
        Ensures no dangerous operators from user input
        
        Args:
            filter_dict: The filter dictionary to sanitize
        
        Returns:
            Sanitized filter dictionary
        """
        sanitized = {}
        
        for key, value in filter_dict.items():
            # Only allow safe keys (no operators)
            if not key.startswith('$'):
                sanitized[key] = NoSQLInjectionProtector.sanitize_query_param(value)
        
        return sanitized


def protect_session_id(session_id: str) -> tuple[bool, str]:
    """
    Validate and protect session ID from NoSQL injection
    
    Returns:
        (is_valid, error_message)
    """
    if not NoSQLInjectionProtector.is_safe_session_id(session_id):
        return False, "Invalid session ID format"
    return True, ""


def protect_user_id(user_id: str) -> tuple[bool, str]:
    """
    Validate and protect user ID from NoSQL injection
    
    Returns:
        (is_valid, error_message)
    """
    if not NoSQLInjectionProtector.is_safe_user_id(user_id):
        return False, "Invalid user ID format"
    return True, ""


def sanitize_for_mongodb(value: Any) -> Any:
    """
    Convenience function to sanitize any value for MongoDB
    
    Args:
        value: Any value that will be used in MongoDB query
    
    Returns:
        Sanitized value safe for MongoDB
    """
    return NoSQLInjectionProtector.sanitize_query_param(value)
