'use client'

import React, { useState } from 'react';

interface LetterProps {
  expected: string;
  typed: string | null;
}

export default function Letter({expected, typed}: LetterProps) {

    let className = "";
    
    if (typed == null) {
        className = "expecting";
    } else if (typed == expected) {
        className = "correct";
    } else {
        className = "incorrect";
    }

    return (
        <span className={className}>{expected}</span>
    )
}