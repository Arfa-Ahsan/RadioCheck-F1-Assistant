"""
Input validation and sanitization for chat messages to prevent prompt injection attacks
"""
import re
from typing import Tuple, Optional

class InputValidator:
    """
    Validates and sanitizes user input to prevent:
    - Prompt injection attacks
    - Command injection
    - Script injection
    - Excessive length attacks
    """
    
    # Maximum allowed input length (characters)
    MAX_LENGTH = 2000
    
    # Minimum length to prevent empty spam
    MIN_LENGTH = 1
    
    # Suspicious patterns that might indicate prompt injection
    SUSPICIOUS_PATTERNS = [
        # System prompt override attempts
        r'ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|directions?)',
        r'forget\s+(everything|all|previous)',
        r'disregard\s+(previous|above|all)',
        r'new\s+(instructions?|task|role|system)',
        r'you\s+are\s+now',
        r'act\s+as\s+(if|a|an)',
        r'pretend\s+(to\s+be|you)',
        r'roleplay\s+as',
        r'simulate\s+being',
        
        # Direct system/role manipulation
        r'</?\s*system\s*>',
        r'</?\s*assistant\s*>',
        r'</?\s*user\s*>',
        r'\[SYSTEM\]',
        r'\[ASSISTANT\]',
        r'\[USER\]',
        
        # Prompt extraction attempts
        r'show\s+(me\s+)?(your|the)\s+(prompt|instructions?|system\s+message)',
        r'what\s+(is|are)\s+your\s+(instructions?|prompt|rules)',
        r'repeat\s+(your|the)\s+(instructions?|prompt)',
        r'print\s+(your|the)\s+(instructions?|prompt)',
        
        # Command injection patterns
        r'<!--',
        r'-->',
        r'<script',
        r'</script>',
        r'javascript:',
        r'eval\s*\(',
        r'exec\s*\(',
        
        # Excessive special characters (possible obfuscation)
        r'[^\w\s\.\,\?\!\-\:\;\'\"]{10,}',
    ]
    
    @staticmethod
    def validate_length(text: str) -> Tuple[bool, Optional[str]]:
        """
        Check if input length is within acceptable bounds
        Returns: (is_valid, error_message)
        """
        if len(text) < InputValidator.MIN_LENGTH:
            return False, "Input is too short. Please enter a question."
        
        if len(text) > InputValidator.MAX_LENGTH:
            return False, f"Input is too long. Maximum {InputValidator.MAX_LENGTH} characters allowed."
        
        return True, None
    
    @staticmethod
    def detect_prompt_injection(text: str) -> Tuple[bool, Optional[str]]:
        """
        Detect potential prompt injection attempts
        Returns: (is_suspicious, warning_message)
        """
        text_lower = text.lower()
        
        for pattern in InputValidator.SUSPICIOUS_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return True, "Your message contains suspicious patterns. Please rephrase your question."
        
        return False, None
    
    @staticmethod
    def sanitize_input(text: str) -> str:
        """
        Sanitize input by removing potentially harmful content
        Returns: cleaned text
        """
        # Remove null bytes
        text = text.replace('\x00', '')
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Trim whitespace
        text = text.strip()
        
        return text
    
    @staticmethod
    def validate(text: str) -> Tuple[bool, Optional[str], str]:
        """
        Complete validation pipeline
        Returns: (is_valid, error_message, sanitized_text)
        """
        # Sanitize first
        clean_text = InputValidator.sanitize_input(text)
        
        # Check length
        is_valid_length, length_error = InputValidator.validate_length(clean_text)
        if not is_valid_length:
            return False, length_error, clean_text
        
        # Check for prompt injection
        is_suspicious, injection_error = InputValidator.detect_prompt_injection(clean_text)
        if is_suspicious:
            return False, injection_error, clean_text
        
        return True, None, clean_text


def validate_user_input(text: str) -> Tuple[bool, Optional[str], str]:
    """
    Convenience function for validating user input
    Returns: (is_valid, error_message, sanitized_text)
    """
    return InputValidator.validate(text)
